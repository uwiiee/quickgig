const { kmeans } = require("ml-kmeans");

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function normalize(value, max) {
  if (!max || max <= 0) return 0;
  return Math.max(0, Math.min(value / max, 1));
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function lowerArray(arr) {
  return safeArray(arr).map((item) => String(item).toLowerCase().trim());
}

function scheduleDays(schedule) {
  return safeArray(schedule)
    .map((s) => s?.day?.toLowerCase()?.slice(0, 3))
    .filter(Boolean);
}

function buildJobFeatures(job, worker, query = "") {
  const workerSkills = lowerArray(worker?.skills);
  const jobSkills = lowerArray(job?.skills);
  const q = String(query).toLowerCase().trim();

  const matchedSkills = jobSkills.filter((skill) =>
    workerSkills.includes(skill),
  );
  const exactSkillMatch =
    jobSkills.length > 0 ? matchedSkills.length / jobSkills.length : 0;

  const querySkillMatch = q
    ? jobSkills.some((skill) => skill.includes(q))
      ? 1
      : 0
    : 0;

  const jobDays = scheduleDays(job?.schedule);
  const matchedDays = jobDays.filter(
    (day) => worker?.availability?.[day] !== "-",
  );
  const scheduleMatch =
    jobDays.length > 0 ? matchedDays.length / jobDays.length : 0;

  let proximityMatch = 0;
  if (
    worker?.coordinates?.latitude != null &&
    worker?.coordinates?.longitude != null &&
    job?.coordinates?.latitude != null &&
    job?.coordinates?.longitude != null
  ) {
    const distance = getDistance(
      worker.coordinates.latitude,
      worker.coordinates.longitude,
      job.coordinates.latitude,
      job.coordinates.longitude,
    );
    proximityMatch = Math.max(0, 1 - distance / 20);
  }

  const payScore = normalize(job?.pay || 0, 5000);

  return {
    exactSkillMatch,
    querySkillMatch,
    scheduleMatch,
    proximityMatch,
    payScore,
  };
}

function buildWorkerFeatures(user, client, query = "") {
  const workerSkills = lowerArray(user?.skills);
  const q = String(query).toLowerCase().trim();

  const querySkillMatch = q
    ? workerSkills.some((skill) => skill.includes(q))
      ? 1
      : 0
    : 0;

  const exactSkillMatch =
    client?.skills?.length > 0
      ? workerSkills.filter((skill) =>
          lowerArray(client.skills).includes(skill),
        ).length / lowerArray(client.skills).length
      : 0;

  const availableDays =
    ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].filter(
      (day) => user?.availability?.[day] && user.availability[day] !== "-",
    ).length / 7;

  let proximityMatch = 0;
  if (
    client?.coordinates?.latitude != null &&
    client?.coordinates?.longitude != null &&
    user?.coordinates?.latitude != null &&
    user?.coordinates?.longitude != null
  ) {
    const distance = getDistance(
      client.coordinates.latitude,
      client.coordinates.longitude,
      user.coordinates.latitude,
      user.coordinates.longitude,
    );
    proximityMatch = Math.max(0, 1 - distance / 20);
  }

  const jobsDoneScore = normalize(user?.jobsDone || 0, 50);

  return {
    exactSkillMatch,
    querySkillMatch,
    scheduleMatch: availableDays,
    proximityMatch,
    payScore: jobsDoneScore,
  };
}

function featureObjectToVector(features) {
  return [
    features.exactSkillMatch,
    features.querySkillMatch,
    features.scheduleMatch,
    features.proximityMatch,
    features.payScore,
  ];
}

function computePriorityScore(features) {
  return (
    features.exactSkillMatch * 0.45 +
    features.querySkillMatch * 0.25 +
    features.scheduleMatch * 0.15 +
    features.proximityMatch * 0.1 +
    features.payScore * 0.05
  );
}

function clusterItems(items, featureBuilder, k = 3) {
  if (!Array.isArray(items) || items.length === 0) return [];

  const enriched = items.map((item) => {
    const features = featureBuilder(item);
    return {
      item,
      features,
      vector: featureObjectToVector(features),
      score: computePriorityScore(features),
      cluster: 0,
    };
  });

  if (enriched.length <= 2) {
    return enriched.sort((a, b) => b.score - a.score);
  }

  const clusterCount = Math.min(k, enriched.length);
  const data = enriched.map((entry) => entry.vector);
  const result = kmeans(data, clusterCount);

  return enriched
    .map((entry, index) => ({
      ...entry,
      cluster: result.clusters[index],
    }))
    .sort((a, b) => b.score - a.score);
}

function filterJobsBySkill(jobs, query = "") {
  const q = String(query).toLowerCase().trim();
  if (!q) return jobs;

  return jobs.filter((job) =>
    lowerArray(job?.skills).some((skill) => skill.includes(q)),
  );
}

function filterWorkersBySkill(workers, query = "") {
  const q = String(query).toLowerCase().trim();
  if (!q) return workers;

  return workers.filter((worker) =>
    lowerArray(worker?.skills).some((skill) => skill.includes(q)),
  );
}

function buildWorkerPostFeatures(post, client, query = "") {
  const clientSkills = lowerArray(client?.skills);
  const postSkills = lowerArray(post?.skills);
  const q = String(query).toLowerCase().trim();

  const matchedSkills = postSkills.filter((skill) =>
    clientSkills.includes(skill),
  );
  const exactSkillMatch =
    postSkills.length > 0 ? matchedSkills.length / postSkills.length : 0;

  const querySkillMatch = q
    ? postSkills.some((skill) => skill.includes(q))
      ? 1
      : 0
    : 0;

  const postDays = scheduleDays(post?.schedule);
  const matchedDays = postDays.filter(
    (day) => client?.availability?.[day] !== "-",
  );
  const scheduleMatch =
    postDays.length > 0 ? matchedDays.length / postDays.length : 0;

  let proximityMatch = 0;
  if (
    client?.coordinates?.latitude != null &&
    client?.coordinates?.longitude != null &&
    post?.coordinates?.latitude != null &&
    post?.coordinates?.longitude != null
  ) {
    const distance = getDistance(
      client.coordinates.latitude,
      client.coordinates.longitude,
      post.coordinates.latitude,
      post.coordinates.longitude,
    );
    proximityMatch = Math.max(0, 1 - distance / 20);
  }

  const payScore = normalize(post?.pay || 0, 5000);

  return {
    exactSkillMatch,
    querySkillMatch,
    scheduleMatch,
    proximityMatch,
    payScore,
  };
}

module.exports = {
  buildJobFeatures,
  buildWorkerFeatures,
  buildWorkerPostFeatures,
  computePriorityScore,
  clusterItems,
  filterJobsBySkill,
  filterWorkersBySkill,
};
