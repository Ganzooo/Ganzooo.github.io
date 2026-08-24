---
layout: page
title: Autonomous-Driving Perception on Automotive SoCs
description: Segmentation, detection and sensor integrity, sized for the hardware that ships.
img:
importance: 8
category: Automotive
related_publications: true
---

## Why it is needed

Perception research is usually benchmarked on a workstation GPU. Perception that ships runs on an automotive SoC with a fixed power budget, chosen years before the model was trained. Everything below was built under that second constraint.

## What I did

**Semantic segmentation.** A UNet architecture with HardNet blocks and a self-attention module, with an end-to-end TensorRT framework ported to ROS.

**2D detection.** A YOLOv7 detector for emergency-vehicle and traffic-police perception, structurally pruned and deployed to a **NextChip APACHE6 NPU**.

**Traffic lights.** ResNet and ResNet+LSTM classification, integrated with a YOLOv7 + SORT tracker so the decision uses temporal context rather than a single frame — a light briefly occluded by a truck should not read as "off".

**Sensor integrity.** Camera soil detection for surround-view lenses on NVIDIA Xavier, and error-pixel detection and recovery on **TI TDA4VM**.

## Result

| Task | Result | Hardware |
|---|---|---|
| Semantic segmentation | 77.1% mean IoU on Cityscapes at 102 FPS | RTX 2080Ti |
| 2D detection | 2x parameter reduction at 0.02 mAP cost; 95% accuracy at 45 FPS | NextChip APACHE6 NPU |
| Traffic-light recognition | 90% accuracy | - |
| Error-pixel recovery | Real-time restoration | TI TDA4VM |

The sensor-integrity work is the piece that is easiest to skip and worst to omit. A perception stack that trusts a degraded sensor does not fail loudly — it keeps producing confident output from bad input, which is the hardest failure to detect downstream.

Code: [Ganzooo/soil_segmentation](https://github.com/Ganzooo/soil_segmentation).
