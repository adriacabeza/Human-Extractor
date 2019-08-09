[![HitCount](http://hits.dwyl.io/adriacabeza/Unnamed.svg)](http://hits.dwyl.io/adriacabeza/Unnamed)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/adriacabeza/Unnamed)
[![GitHub stars](https://img.shields.io/github/stars/adriacabeza/Unnamed.svg)](https://GitHub.com/adriacabeza/Unnamed/stargazers/)
[![GitHub forks](https://img.shields.io/github/forks/adriacabeza/Unnamed.svg)](https://GitHub.com/adriacabeza/Unnamed/network/)
[![GitHub repo size in bytes](https://img.shields.io/github/repo-size/adriacabeza/Unnamed.svg)](https://github.com/adriacabeza/Unnamed)


# UNNAMED

This code was made public to share our research for the benefit of the scientific community. Do NOT use it for immoral purposes. 

## Prerequisites
- Tensorflow 2.0
- Install requirements.txt

```bash
pip install -r requirements.txt
```
## Architecture
This repository is based on **pix2pix** architecture by Isola et al. In this architecture we take as input the actual image *x* that we want to *translate* into another structurally similar image $y$. Our generator now has to produce $G(x)$ which we want to be indistinguishable from **y**.

Its main parts are:
- **U-NET Generator**: the generator in pix2pix resembles an auto-encoder. It takes the     image to be translated and compresses it into a low-dimensional, "Bottleneck", vector representat    ion and then the Generator then learns how to upsample it into the output image.

The U-NET generator is similar to ResNets in the way the information from earlier layers are integrated in the later layers: we have skip connections from the outputs of the encoder-hald of the network to the other decoder-half. By including this information we prevent the middle of the network to become an information bottleneck. Moreover, tose skip connections are also interesting because they do not require any resizing, projections, etc, since the spatial resolution of the layers being connected already match each other.
 <p align="center">
  <img src="docs/U-net.png">
</p>

 - **PatchGAN Discriminator**: instead of taking all the image and trying to classify whether is real or fake, this discriminator classifies individual different patches of the image. This is a way to enforce more contraints that encourage sharp high-frequency details. Also it runs faster than classifying the entire image since it only classifies tiny patches it has less parameters.
 <p align="center">
  <img src="docs/patch_gan.png">
</p>


## Dataset

We need to prepare our dataset. Each X/Y pair of images must be blended in half of the full image in the set.

## Run

```bash
python3 -m src.train --dataset PATH_TO_DATASET
```


