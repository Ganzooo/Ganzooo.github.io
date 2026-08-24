---
layout: page
permalink: /code/
title: code
description: Released implementations and challenge solutions.
nav: true
nav_order: 4
---

## GitHub

{% include repository/repo_user.liquid username=site.data.repositories.github_users.first %}

---

## Repositories

<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% for repo in site.data.repositories.github_repos %}
    {% include repository/repo.liquid repository=repo %}
  {% endfor %}
</div>
