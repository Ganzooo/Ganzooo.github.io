---
layout: page
title: Driver-State Monitoring for UN-R171 DCAS
description: A driver monitoring system built to the requirement the regulation actually names.
img:
importance: 1
category: Automotive
related_publications: false
---

UN-R171 governs Driver Control Assistance Systems. Section 5.5.4 says a vehicle that keeps steering for you must still confirm you are driving, and it names the device that does the confirming: a **driver state monitoring system**. This project is that device, built as KETI's in-cabin track inside a nine-institution national SDV programme (TRL 4 to 7).

I turned the regulation text into a testable specification, defined and collected the in-cabin dataset, proposed the recognition methods, and implemented the running system from the camera driver and ROS pipeline through to the output signals.

**How it works.** Gaze zone, eye closure (EAR), PERCLOS and head pose feed a six-rule Euro NCAP time-rule state machine that classifies the driver as `NORMAL`, `DISTRACTED`, `DROWSY` or `UNRESPONSIVE`.

**One design decision worth naming.** Every NCAP threshold lives in a configuration file, never as a code constant. A compliance rule you cannot read off without opening source code is a rule nobody can audit. Keeping the rule layer separate from the signal layer means the thresholds can be checked against the standard directly — and changed when the standard changes — without touching recognition code.

I also produced the conformance mapping across **UN-R171, GSR II, Euro NCAP and UN-R157**, which is how you find out that requirements which look equivalent are not. GSR II's drowsiness criterion is stated in KSS; this system measures PERCLOS. Neither derives from the other, and writing that down explicitly was more useful than papering over it.

Jetson AGX Orin porting and real-vehicle validation come in later programme phases.
