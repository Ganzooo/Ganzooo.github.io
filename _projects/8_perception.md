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

Perception research is benchmarked on a workstation GPU against a clean daytime dataset. Perception that ships runs on an automotive SoC chosen years before the model existed, in rain, at night, against a sun low on the horizon. Everything below was built under the second set of conditions, and validated against them separately rather than through a single averaged score.

## What I did

**Semantic segmentation.** A UNet architecture with HardNet blocks and a self-attention module, with an end-to-end TensorRT framework ported to ROS. Reaches **77.1% mean IoU on Cityscapes at 102 FPS** on an RTX 2080Ti, and was exported for the target SoC at both 1024x512 and 640x384.

Beyond the public benchmark, it was validated on KETI's own 14-class driving dataset under three separate capture conditions rather than one mixed set.

{% include figure.liquid loading="eager" path="assets/img/projects/seg_conditions.svg" class="img-fluid rounded" %}

**2D detection.** A YOLOv7 detector for emergency-vehicle and traffic-police perception, structurally pruned and deployed to a **NextChip APACHE6 NPU**.

**Traffic lights.** ResNet and ResNet+LSTM classification integrated with a detector and a SORT tracker, so the decision uses temporal context. A light briefly occluded by a truck should not read as "off".

**Sensor integrity.** Camera soil detection for surround-view lenses on NVIDIA Xavier, and error-pixel detection and recovery on **TI TDA4VM**.

{% include figure.liquid loading="eager" path="assets/img/projects/soil_detection_result.png" class="img-fluid rounded z-depth-1" %}

<div class="caption">Camera soil detection on a surround-view fisheye lens: input left, predicted soiled regions right. This is the failure the model exists to catch - the lens is dirty, the scene still looks plausible, and nothing downstream would flag it.</div>

## Result

| Task                       | Result                                                          | Hardware             |
| -------------------------- | --------------------------------------------------------------- | -------------------- |
| Semantic segmentation      | 77.1% mean IoU (Cityscapes) at 102 FPS                          | RTX 2080Ti           |
| Segmentation, KETI dataset | 77% day / 69% night / 77% rain mean IoU                         | -                    |
| 2D detection               | 2x parameter reduction at 0.02 mAP cost; 95% accuracy at 45 FPS | NextChip APACHE6 NPU |
| Traffic-light recognition  | 90% accuracy                                                    | -                    |
| Error-pixel recovery       | Real-time restoration                                           | TI TDA4VM            |

### What the condition split shows

Averaged over all classes, night costs about 8 points of mIoU and rain costs nothing. That summary is misleading, and the per-class numbers say why:

| Class         | Day      | Night    | Rain     |
| ------------- | -------- | -------- | -------- |
| Road          | 0.98     | 0.98     | 0.99     |
| Car           | 0.94     | 0.91     | 0.96     |
| Traffic light | 0.64     | 0.49     | 0.70     |
| Pole          | 0.62     | 0.49     | 0.62     |
| **Human**     | **0.71** | **0.43** | **0.45** |

Road and Car barely move — they are large, high-contrast, and the model has plenty of signal for them in any condition. The classes that collapse are the thin and small ones, and the worst of them is **Human**, which loses nearly 40% of its IoU at night and does almost as badly in rain.

That is the opposite of a comfortable result. The single mIoU figure improves fastest by getting better at road and sky, which are already solved and carry the most pixels, while the class whose failure actually matters degrades unseen underneath it. It is the reason the validation set was split by condition in the first place: a mixed set would have averaged this away.

The same reasoning drives the sensor-integrity work. A perception stack that trusts a soiled lens does not fail loudly. It keeps producing confident output from bad input, which is the hardest failure to catch anywhere downstream.

Code: [Ganzooo/soil_segmentation](https://github.com/Ganzooo/soil_segmentation).
