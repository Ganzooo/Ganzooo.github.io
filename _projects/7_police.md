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

{% include figure.liquid loading="eager" path="assets/img/projects/police_deployment.svg" class="img-fluid rounded" %}

<div class="caption">The deployed path: camera to ROS 2 ingest, inference on an edge box installed at the control tower, and the recognised gesture published to other systems over an API.</div>

## Result

- **99% accuracy at 33 FPS**
- Running on site at a control tower, feeding other systems over an API

Real-time speed came from efficient frame buffering and cutting CPU work. I did not add an accelerator. On a deployment where the hardware is already installed and the budget is already spent, that is the whole problem. "It would be fast enough on better hardware" is not an answer.

Code: [Ganzooo/yolov10_track_ros_gesture](https://github.com/Ganzooo/yolov10_track_ros_gesture), detection, tracking, classification and gesture recognition.

---

<strong>Related</strong> — [Autonomous-driving perception]({{ '/projects/8_perception/' | relative_url }}) · [Multi-camera in-cabin inference]({{ '/projects/2_fms/' | relative_url }})
