"use client";

import { useState } from "react";
import { formatDate, formatCurrency, JOB_STATUS_LABELS } from "@/lib/constants";
import { updateJobStatus } from "@/app/actions/jobs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Job {
  id: string;
  title: string;
  province: string;
  city: string | null;
  status: "DRAFT" | "PUBLISHED" | "PAUSED" | "CLOSED";
  createdAt: Date | string;
  salaryArsMin: number | null;
  salaryArsMax: number | null;
  _count: {
    applicants: number;
  };
}

export function CompanyJobsList({ jobs }: { jobs: Job[] }) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusChange = async (jobId: string, newStatus: "PUBLISHED" | "PAUSED" | "CLOSED") => {
    setUpdating(jobId);
    try {
      await updateJobStatus(jobId, newStatus);
      toast.success("Estado actualizado", {
        description: `El empleo ahora está ${JOB_STATUS_LABELS[newStatus].toLowerCase()}`,
      });
      router.refresh();
    } catch (error: any) {
      toast.error("Error al actualizar estado", {
        description: error.message || "Por favor, intentá nuevamente",
      });
    } finally {
      setUpdating(null);
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          No tenés empleos publicados todavía
        </p>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Andá a la pestaña &quot;Crear empleo&quot; para publicar tu primer puesto.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {jobs.map((job) => (
        <article
          key={job.id}
          className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                {job.title}
              </h3>
              <div className="flex flex-wrap gap-4 text-base text-gray-600 dark:text-gray-400">
                <span>
                  {job.city ? `${job.city}, ${job.province}` : job.province}
                </span>
                {job.salaryArsMin && job.salaryArsMax && (
                  <span>
                    {formatCurrency(job.salaryArsMin)} -{" "}
                    {formatCurrency(job.salaryArsMax)}
                  </span>
                )}
                <span>Publicado el {formatDate(job.createdAt)}</span>
              </div>
            </div>
            <span
              className={`rounded-full px-4 py-2 text-base font-bold ${
                job.status === "PUBLISHED"
                  ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400"
                  : job.status === "PAUSED"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              {JOB_STATUS_LABELS[job.status]}
            </span>
          </div>

          <div className="mb-4 text-lg font-semibold text-primary-700 dark:text-primary-400">
            {job._count.applicants}{" "}
            {job._count.applicants === 1 ? "postulación" : "postulaciones"}
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={`/empleos/${job.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-gray-600 px-4 py-2 text-base font-semibold text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300"
            >
              Ver empleo
            </a>

            {job.status === "PUBLISHED" && (
              <button
                onClick={() => handleStatusChange(job.id, "PAUSED")}
                disabled={updating === job.id}
                className="rounded-lg bg-yellow-600 px-4 py-2 text-base font-semibold text-white hover:bg-yellow-700 disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-yellow-300"
              >
                Pausar
              </button>
            )}

            {job.status === "PAUSED" && (
              <button
                onClick={() => handleStatusChange(job.id, "PUBLISHED")}
                disabled={updating === job.id}
                className="rounded-lg bg-green-600 px-4 py-2 text-base font-semibold text-white hover:bg-green-700 disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-green-300"
              >
                Reactivar
              </button>
            )}

            {(job.status === "PUBLISHED" || job.status === "PAUSED") && (
              <button
                onClick={() => handleStatusChange(job.id, "CLOSED")}
                disabled={updating === job.id}
                className="rounded-lg bg-red-600 px-4 py-2 text-base font-semibold text-white hover:bg-red-700 disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-red-300"
              >
                Cerrar
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
