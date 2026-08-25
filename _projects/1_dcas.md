---
layout: page
title: Driver-State Monitoring for UN-R171 DCAS
description: Building the device a regulation names, to the standard that defines it.
img: assets/img/projects/dcas_dashboard.png
importance: 1
category: In-cabin sensing
related_publications: false
---

## Why it is needed

UN-R171 is the rule for Driver Control Assistance Systems. It lets a car keep steering and controlling speed, but only if the driver has not stopped paying attention to the road. Section 5.5.4 names the device that has to check this: a driver state monitoring system.

So this is a compliance part, not a demo. It has to give an answer to "was the driver paying attention at time T" that someone else can audit, and it has to give it on hardware inside the car.

## What I did

This is KETI's in-cabin track in a national SDV programme with nine institutions (TRL 4 to 7). I did the whole thing:

- **Specification.** I turned the UN-R171 Section 5.5.4 requirement into a spec we could test against: what to measure, at what threshold, over what time window.
- **Dataset.** I chose the sensor setup and the capture scenarios, decided how to split train and eval, and collected the data.
- **Method.** I proposed the signals: gaze zone, eye closure (EAR), PERCLOS, and head pose.

{% include figure.liquid loading="eager" path="assets/img/projects/dcas_gaze_zone.png" class="img-fluid rounded" %}

<div class="caption">Gaze zone is derived by binning head-pose yaw. The boundaries are per-vehicle and live in the calibration file, not in the code, so a different cabin geometry is a config change rather than a code change.</div>
- **System.** I built the running pipeline, from the camera driver and ROS integration through to the output signals.

Those four signals feed a six-rule Euro NCAP state machine. It puts the driver in one of four states: `NORMAL`, `DISTRACTED`, `DROWSY`, `UNRESPONSIVE`.

{% include figure.liquid loading="eager" path="assets/img/projects/dcas_two_track.png" class="img-fluid rounded" %}

<div class="caption">The two tracks that run on the in-cabin camera. Track 1 produces the Euro NCAP driver state; track 2 recognises what the driver is doing. Both start from the same frame.</div>

{% include figure.liquid loading="eager" path="assets/img/projects/dcas_state_machine.png" class="img-fluid rounded" %}

<div class="caption">The rules, with their thresholds. Escalation in red, recovery dashed. Eye-closed for 3s or PERCLOS above 80% over a 60s window gives DROWSY; 6s gives UNRESPONSIVE. Off-road gaze for 3s, or 10s summed over 30s, gives DISTRACTED. States are ordered, so the most serious condition wins.</div>

### One decision I want to explain

Every NCAP threshold lives in a config file. None of them are constants in the code. If you can only read a compliance rule by opening a Python file, nobody outside the team can audit it. Keeping the rule layer separate from the signal layer means the thresholds can be checked against the standard directly, and updated when the standard changes, without touching the recognition code.

I also wrote the conformance mapping across UN-R171, GSR II, Euro NCAP and UN-R157. Doing that is how you find out that requirements which look the same are not. GSR II states its drowsiness criterion in KSS. This system measures PERCLOS. You cannot derive one from the other, and writing that down was more useful than quietly picking one.

{% include figure.liquid loading="eager" path="assets/img/projects/dcas_dashboard.png" class="img-fluid rounded z-depth-1" %}

<div class="caption">Live driver-state output. The top overlay shows the signals for that frame: eye state, gaze zone, head pose. The strip below shows each Euro NCAP rule against its threshold. The banner shows the state those rules produce.</div>

## Result

A running system that outputs a driver state for every frame, with the full signal trace behind it. Eye-closure time, off-road gaze time and PERCLOS are each shown against their thresholds, so you can trace any state change back to the rule that caused it.

Porting to Jetson AGX Orin and validation in a real vehicle come in later phases of the programme.

<span class="code-note">Programme code is not public.</span>

---

<strong>Related</strong> — [QueryGaze, the gaze component]({{ '/projects/3_gaze/' | relative_url }}) · [Multi-camera in-cabin inference]({{ '/projects/2_fms/' | relative_url }})
