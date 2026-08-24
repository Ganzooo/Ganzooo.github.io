---
layout: page
title: Driver-State Monitoring for UN-R171 DCAS
description: Building the device a regulation names, to the standard that defines it.
img:
importance: 1
category: Automotive
related_publications: false
---

## Why it is needed

UN-R171 governs Driver Control Assistance Systems. It permits a vehicle to keep steering and controlling speed, but only on the condition that the driver has not disengaged from the driving task — and Section 5.5.4 names the device that must verify this: a **driver state monitoring system**.

That makes this a compliance component, not a research demo. It has to produce a defensible answer to "was the driver engaged at time T", on hardware in the vehicle, against a written standard someone else will audit.

## What I did

This is KETI's in-cabin track in a nine-institution national SDV programme (TRL 4 to 7). I owned it end to end:

- **Specification.** Turned the UN-R171 Section 5.5.4 requirement into a testable specification — what gets measured, at what threshold, over what window.
- **Dataset.** Defined the in-cabin sensor configuration, capture scenarios, and the train/eval split methodology, then collected the data.
- **Method.** Proposed the recognition approach: gaze zone, eye closure (EAR), PERCLOS and head pose as the signal layer.
- **System.** Implemented the running pipeline from the camera driver and ROS integration through to the output signals.

Those four signals feed a **six-rule Euro NCAP time-rule state machine** that classifies the driver as `NORMAL`, `DISTRACTED`, `DROWSY` or `UNRESPONSIVE`.

### One decision worth explaining

Every NCAP threshold lives in a configuration file, never as a constant in source code. A compliance rule you can only read by opening a `.py` file is a rule nobody outside the team can audit. Separating the rule layer from the signal layer means thresholds can be checked against the standard directly, and updated when the standard moves, without touching recognition code.

I also produced the conformance mapping across **UN-R171, GSR II, Euro NCAP and UN-R157**. That exercise is where you learn that requirements which look interchangeable are not: GSR II states its drowsiness criterion in KSS, this system measures PERCLOS, and neither derives from the other. Writing that non-equivalence down explicitly was more useful than quietly picking one.

## Result

A running system that emits a per-frame driver state with the full signal trace behind it — eye-closure duration, off-road gaze duration, and PERCLOS each shown against their rule thresholds, so any state transition can be traced back to the rule that fired it.

Jetson AGX Orin porting and real-vehicle validation follow in later programme phases.
