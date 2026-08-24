---
layout: page
title: Autonomous-Driving Perception on Automotive SoCs
description: Segmentation, detection and sensor integrity, sized for the hardware that ships.
img:
importance: 8
category: automotive
related_publications: true
---

Several years of perception work at KETI, with a consistent constraint: it has to run on the board the vehicle actually has.

**Semantic segmentation.** A UNet architecture with HardNet blocks and a self-attention module, with an end-to-end TensorRT framework ported to ROS — **77.1% mean IoU on Cityscapes at 102 FPS** on an RTX 2080Ti.

**2D detection.** A YOLOv7 detector for emergency-vehicle and traffic-police perception, structurally pruned for a **2x parameter reduction at a 0.02 mAP cost**, deployed to a **NextChip APACHE6 NPU** at 95% accuracy and 45 FPS.

**Traffic lights.** ResNet and ResNet+LSTM classification at 90%, integrated with a YOLOv7 + SORT tracker over single and temporal frames.

**Sensor integrity.** Camera soil detection for surround-view lenses on NVIDIA Xavier, and error-pixel detection and recovery on **TI TDA4VM** — because a perception stack that trusts a degraded sensor fails quietly, which is the worst way to fail.
