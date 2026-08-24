---
layout: page
title: Traffic-Police Gesture Recognition at a Control Tower
description: A deployed edge system, not just a model.
img:
importance: 7
category: Automotive
related_publications: true
---

## Why it is needed

Traffic-police hand signals override normal traffic rules. A vehicle or roadside system that cannot read them will confidently obey the wrong instruction — a red light that an officer is waving traffic through, or a green one they are holding. The failure mode is not "missed detection", it is "correct behaviour applied to the wrong ground truth".

## What I did

**The model:** a **Linear Transformer** fusing visual appearance with keypoint data. Appearance alone confuses similar arm positions; keypoints alone lose the officer's uniform and context that distinguish an officer from a pedestrian gesturing.

**The system:** I designed the deployed inference pipeline — camera ingest through a **ROS 2** package, on-site inference on an edge compute box **at a traffic control tower**, and recognition results published to other systems over an API.

## Result

- **99% accuracy at 33 FPS**
- Running on-site at a control tower, feeding downstream systems over an API

Real-time throughput came from efficient frame buffering and cutting CPU work — not from adding an accelerator. On a deployment where the hardware is already installed and the budget already spent, that distinction is the entire problem: "it would be fast enough on better hardware" is not an answer.

Code: [Ganzooo/yolov10_track_ros_gesture](https://github.com/Ganzooo/yolov10_track_ros_gesture) - detection, tracking, classification and gesture recognition.
