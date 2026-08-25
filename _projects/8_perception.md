---
layout: page
title: Autonomous-Driving Perception on Automotive SoCs
description: Segmentation, detection and sensor integrity, measured under the conditions the vehicle actually drives in.
img: assets/img/projects/seg_conditions.png
importance: 8
category: Automotive
related_publications: true
---

## Why it is needed

Perception research is benchmarked on a workstation GPU against a clean daytime dataset. Perception that ships runs on an automotive SoC that was chosen years before the model existed, in rain, at night, with the sun low on the horizon. Everything below was built for the second case, and checked against each condition separately instead of through one averaged score.

## What I did

**Semantic segmentation.** A UNet architecture with HardNet blocks and a self-attention module, with an end-to-end TensorRT framework ported to ROS. It reaches **77.1% mean IoU on Cityscapes at 102 FPS** on an RTX 2080Ti, and was exported for the target SoC at 1024x512 and 640x384.

Beyond the public benchmark, I validated it on KETI's own 14-class driving dataset under three capture conditions, kept separate.

{% include figure.liquid loading="eager" path="assets/img/projects/seg_conditions.svg" class="img-fluid rounded" %}

**2D detection.** A YOLOv7 detector for emergency-vehicle and traffic-police perception, structurally pruned and deployed to a NextChip APACHE6 NPU.

**Traffic lights.** ResNet and ResNet+LSTM classification with a detector and a SORT tracker, so the decision uses time as well as one frame. A light hidden behind a truck for a moment should not read as "off".

**Sensor integrity.** Camera soil detection for surround-view lenses on NVIDIA Xavier, and error-pixel detection and recovery on TI TDA4VM.

{% include figure.liquid loading="eager" path="assets/img/projects/soil_detection_result.png" class="img-fluid rounded z-depth-1" %}

<div class="caption">Camera soil detection on a surround-view fisheye lens: input on the left, predicted soiled areas on the right. This is the failure the model exists to catch. The lens is dirty, the scene still looks reasonable, and nothing downstream would notice.</div>

## Result

| Task                       | Result                                                          | Hardware             |
| -------------------------- | --------------------------------------------------------------- | -------------------- |
| Semantic segmentation      | 77.1% mean IoU (Cityscapes) at 102 FPS                          | RTX 2080Ti           |
| Segmentation, KETI dataset | 77% day / 69% night / 77% rain mean IoU                         | -                    |
| 2D detection               | 2x parameter reduction at 0.02 mAP cost; 95% accuracy at 45 FPS | NextChip APACHE6 NPU |
| Traffic-light recognition  | 90% accuracy                                                    | -                    |
| Error-pixel recovery       | Real-time restoration                                           | TI TDA4VM            |

### What the condition split shows

Averaged over all classes, night costs about 8 points of mIoU and rain costs nothing. That summary is misleading, and the per-class numbers show why:

| Class         | Day      | Night    | Rain     |
| ------------- | -------- | -------- | -------- |
| Road          | 0.98     | 0.98     | 0.99     |
| Car           | 0.94     | 0.91     | 0.96     |
| Traffic light | 0.64     | 0.49     | 0.70     |
| Pole          | 0.62     | 0.49     | 0.62     |
| **Human**     | **0.71** | **0.43** | **0.45** |

Road and Car barely move. They are large and high-contrast, so the model has plenty of signal for them in any condition. The classes that fall are the thin and small ones, and the worst is **Human**. It loses almost 40% of its IoU at night, and does nearly as badly in rain.

This is an uncomfortable result. The single mIoU number goes up fastest if you improve road and sky, which are already solved and cover the most pixels. Meanwhile the class whose failure actually matters gets worse underneath it. That is why I split the validation set by condition. A mixed set would have hidden this.

The same reasoning is behind the sensor-integrity work. A perception stack that trusts a dirty lens does not fail loudly. It keeps giving confident output from bad input, and that is the hardest kind of failure to catch further down the system.

Code: [Ganzooo/soil_segmentation](https://github.com/Ganzooo/soil_segmentation).
