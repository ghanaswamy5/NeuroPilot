import os
import cv2
import torch
import numpy as np

OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)


class GradCAM:
    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer

        self.activations = None
        self.gradients = None

        target_layer.register_forward_hook(self.forward_hook)
        target_layer.register_full_backward_hook(self.backward_hook)

    def forward_hook(self, module, input, output):
        self.activations = output

    def backward_hook(self, module, grad_input, grad_output):
        self.gradients = grad_output[0]

    def generate(self, image_tensor):
        self.model.eval()

        output = self.model(image_tensor)
        pred_class = output.argmax(dim=1)

        self.model.zero_grad()
        output[:, pred_class].backward()

        gradients = self.gradients[0]
        activations = self.activations[0]

        weights = torch.mean(gradients, dim=(1, 2))

        cam = torch.zeros(
            activations.shape[1:],
            dtype=torch.float32,
            device=activations.device,
        )

        for i, w in enumerate(weights):
            cam += w * activations[i]

        cam = torch.relu(cam)
        cam = cam.detach().cpu().numpy()

        cam -= cam.min()

        if cam.max() != 0:
            cam /= cam.max()

        return cam


def overlay_heatmap(original_image, cam):
    """
    original_image : OpenCV image (BGR or grayscale)
    cam            : numpy array (0-1)
    """
    h, w = original_image.shape[:2]
    cam = cv2.resize(cam, (w, h))

    # Ensure base image has 3 channels for overlay
    if len(original_image.shape) == 2 or (len(original_image.shape) == 3 and original_image.shape[2] == 1):
        base_img = cv2.cvtColor(original_image, cv2.COLOR_GRAY2BGR)
    else:
        base_img = original_image.copy()

    heatmap = np.uint8(255 * cam)
    heatmap = cv2.applyColorMap(
        heatmap,
        cv2.COLORMAP_JET
    )

    overlay = cv2.addWeighted(
        base_img,
        0.6,
        heatmap,
        0.4,
        0
    )

    return overlay


def save_overlay(original_image, cam, filename="gradcam_result.png"):
    overlay = overlay_heatmap(original_image, cam)

    output_path = os.path.join(
        OUTPUT_DIR,
        filename
    )

    cv2.imwrite(output_path, overlay)

    return output_path


def generate_gradcam(model, image_tensor, original_image):
    """
    Generate Grad-CAM heatmap and save overlay image.
    """
    gradcam = GradCAM(model, model.conv[3])

    cam = gradcam.generate(image_tensor)

    output_path = save_overlay(
        original_image,
        cam,
        "mri_gradcam.png"
    )

    return output_path
