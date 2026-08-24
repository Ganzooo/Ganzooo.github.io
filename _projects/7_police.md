---
layout: page
title: Traffic-Police Gesture Recognition at a Control Tower
description: A deployed edge system, not just a model.
img:
importance: 7
category: automotive
related_publications: true
---

Traffic-police hand signals override normal traffic rules, so a vehicle that cannot read them is a vehicle that will obey the wrong instruction.

The recognition model is a **Linear Transformer** fusing visual appearance with keypoint data, reaching **99% accuracy at 33 FPS**.

The more interesting part is the system around it. I designed the deployed inference pipeline: camera ingest through a **ROS 2** package, on-site inference on an edge compute box **at a traffic control tower**, and recognition results published to other systems over an API.

Real-time throughput came from efficient frame buffering and cutting CPU work — not from adding an accelerator. On a deployment where the hardware is already installed and the budget is already spent, that distinction is the whole problem.

Code: [Ganzooo/yolov10_track_ros_gesture](https://github.com/Ganzooo/yolov10_track_ros_gesture) - detection, tracking, classification and gesture recognition.
