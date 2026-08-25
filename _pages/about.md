---
layout: about
title: About
permalink: /
subtitle: Computer-vision researcher at <a href="https://www.keti.re.kr/">KETI</a> — efficient and on-device AI.

profile:
  align: right
  image: a1_ganzo.jpg
  image_circular: false
  more_info: >
    <p>Korea Electronics Technology Institute</p>
    <p>Seoul, South Korea</p>

selected_papers: true
social: true

announcements:
  enabled: true
  scrollable: true
  limit: 5

latest_posts:
  enabled: false
  scrollable: true
  limit: 3
---

I am a computer-vision researcher at the **Korea Electronics Technology Institute (KETI)**. I work in the **perception team** of the autonomous-driving vehicle systems group, and most of my projects come from that one car.

I started on the outside of the car. I worked on real-time semantic segmentation, 2D detection for emergency vehicles and traffic police, and traffic-light recognition. All of it had to run on the automotive chips the car already has, not on a desktop GPU. That work, together with 3D object detection on the Apollo platform, helped our team get an **autonomous test-driving licence**. After that the car was allowed to drive on the road.

Once the car was on the road, safety became the focus. A dirty lens or a dead pixel does not matter much in a lab, but it matters when the car is driving in traffic. I worked on error-pixel recovery, camera soil detection, action recognition and emergency-vehicle detection.

After that I moved inside the cabin, and that is where most of my work is now. UN-R171 says a car that steers for you must check that you are still paying attention. I built a **driver-state monitoring system** for that rule, with a six-rule Euro NCAP state machine. I also built a **four-camera system** that recognises what each passenger is doing. It runs on one Jetson AGX Orin at 10 Hz.

I am now starting work on **end-to-end self-driving with vision-language models (VLM)**, which brings me back to the driving task itself.

Efficiency is part of every one of these projects. I use INT8 quantization, reparameterization, structural pruning, and TensorRT / ONNX / LiteRT so a model fits the compute budget the car actually has. The same methods won five international efficiency challenges.

Outside KETI I am part of **[Team Z6](https://teamz6.github.io/)**, a study group working on efficient on-device computer vision. The super-resolution results below came from that group.

{% include figure.liquid loading="eager" path="assets/img/projects/career_arc.svg" class="img-fluid rounded" %}

<div class="caption">My work in one picture. Outward perception first, then the test-driving licence, then the safety work needed once the car was on the road, then inside the cabin. VLM-based end-to-end self-driving is next. The efficiency work at the bottom is used in all of them.</div>

## Research Interests

- Efficient on-device inference — quantization, pruning, reparameterization
- Vision-language models under hard token and memory budgets
- End-to-end self-driving with vision-language models
- Driver and occupant monitoring, to UN-R171 and Euro NCAP requirements
- Autonomous-driving perception on automotive SoCs
- Real-time super-resolution and image restoration

## Focus, in order

- **Outward perception** — 2D detection and semantic segmentation on automotive SoCs, 3D detection on the Apollo platform, which took the team to an autonomous test-driving licence — [project]({{ '/projects/8_perception/' | relative_url }})
- **Safe self-driving** — once the car was on the road: error-pixel recovery, camera soil detection, action recognition and emergency-vehicle detection — [perception]({{ '/projects/8_perception/' | relative_url }}) · [gesture]({{ '/projects/7_police/' | relative_url }})
- **In-cabin sensing** (current) — driver-state monitoring to UN-R171 Section 5.5.4, and four-camera occupant recognition at a fixed 10 Hz — [driver state]({{ '/projects/1_dcas/' | relative_url }}) · [multi-camera]({{ '/projects/2_fms/' | relative_url }})
- **VLM end-to-end self-driving** (starting) — vision-language models driving the car directly, building on the on-device vision-language work below

## Selected Awards

- 🥇 **1st place**, LPCVC 2026 Track 3 @ CVPR — on-device vision-language AIGC detection
- 🥇 **1st place**, AIS 2024 @ CVPR — real-time image super-resolution
- 🥇 **1st place**, Mobile AI & AIM 2022 @ ECCV — real-time super-resolution (team leader)
- 🥈 **2nd place**, MAI 2025 @ CVPR — quantized image super-resolution
- 🥈 **2nd place**, AI Grand Challenge 2020, IITP — AI model optimization

## Education

- **Ph.D. in Electrical and Electronic Engineering**, Yonsei University (2011 – 2020) — Image & Information Lab
- **M.S. in Electronics & Information Communication**, Konkuk University (2006 – 2009) — VLSI Lab
- **B.S. in Information and Communication**, Huree University of ICT, Mongolia (2002 – 2006)

## Experience

- **Postdoctoral Researcher**, Korea Electronics Technology Institute (Jun 2018 – Present)
- **Computer Vision Researcher**, Chowis Co., Ltd. (Nov 2016 – May 2018)
- **Assistant Professor**, Huree University of ICT, Mongolia (Mar 2009 – Aug 2010)

637 citations · h-index 10 · four U.S. patents (three granted)
