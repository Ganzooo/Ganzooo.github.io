---
layout: page
title: Traffic-Police Gesture Recognition at a Control Tower
description: A deployed edge system, not just a model.
img: assets/img/projects/police_deployment.png
importance: 1
category: Safe self-driving
related_publications: true
---

## Why it is needed

Traffic-police hand signals override the normal traffic rules. A vehicle or roadside system that cannot read them will confidently follow the wrong instruction: a red light an officer is waving traffic through, or a green one they are holding. The failure is not a missed detection. It is correct behaviour applied to the wrong ground truth.

## What I did

**The model** is a Linear Transformer that fuses visual appearance with keypoint data. Appearance alone confuses similar arm positions. Keypoints alone lose the uniform and the context that separate an officer from a pedestrian waving.

**The system** is the deployed inference pipeline, which I designed: camera ingest through a ROS 2 package, on-site inference on an edge compute box at a traffic control tower, and results published to other systems over an API.

{% include figure.liquid loading="eager" path="assets/img/projects/police_actionnet.png" class="img-fluid rounded" %}

<div class="caption">An earlier version of the action network, showing the shape of the problem: a 32-frame sequence goes through a ResNet18 feature extractor and an LSTM classifies the sequence. The deployed model keeps that sequence-in, action-out structure but replaces the LSTM with a Linear Transformer and adds the keypoint branch alongside appearance.</div>

{% include figure.liquid loading="eager" path="assets/img/projects/police_deployment.svg" class="img-fluid rounded" %}

<div class="caption">The deployed path: camera to ROS 2 ingest, inference on an edge box installed at the control tower, and the recognised gesture published to other systems over an API.</div>

{% include figure.liquid loading="eager" path="assets/img/projects/police_results.jpg" class="img-fluid rounded z-depth-1" %}

<div class="caption">Deployed output on Korean roads. Left: an officer detected and classified as Traffic_Police, with the gesture read from the frame sequence. Right: the same camera detecting an ambulance alongside cars, traffic signs and traffic lights. The officer's face is blurred here for publication only.</div>

## Result

- **99% accuracy at 33 FPS**
- Running on site at a control tower, feeding other systems over an API

Real-time speed came from efficient frame buffering and cutting CPU work. I did not add an accelerator. On a deployment where the hardware is already installed and the budget is already spent, that is the whole problem. "It would be fast enough on better hardware" is not an answer.

Code: [Ganzooo/yolov10_track_ros_gesture](https://github.com/Ganzooo/yolov10_track_ros_gesture), detection, tracking, classification and gesture recognition.

---

<strong>Related</strong> — [Error-pixel detection and recovery]({{ '/projects/11_pixelerror/' | relative_url }}) · [Camera soil detection]({{ '/projects/12_soil/' | relative_url }}) · [Autonomous-driving perception]({{ '/projects/8_perception/' | relative_url }})
