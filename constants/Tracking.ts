export const TrackWorkingLabels: Record<string, string | null> = {
  accepted: `You have accepted this job. This does not guarantee you as the worker. Please wait for the employer to approve you for the job.`,
  approved: `You have been approved for this job. Let them know when you have started the job.`,
  "in progress": `The job is in progress and the user is awaiting its completion. Let them know when you've completed the job.`,
  complete: `The job has been marked as complete. Expect to receive your payment soon.`,
  paid: null,
};

export const TrackHiringLabels: Record<string, string | null> = {
  accepted: null,
  approved:
    "You have approved a worker for the job. They will update their progress.",
  "in progress":
    "The worker has marked this job as in progress. Wait for them to complete the job.",
  complete:
    "The job is marked as complete and the worker is awaiting your payment.",
  paid: null,
};
