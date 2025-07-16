import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const scoreSchema = z.object({
  initials: z
    .string()
    .min(1, "Please enter your initials")
    .max(3, "Maximum 3 characters"),
});

type ScoreFormData = z.infer<typeof scoreSchema>;

interface ScoreModalProps {
  isOpen: boolean;
  gameTime: number;
  onSubmit: (initials: string) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

const ScoreModal = ({
  isOpen,
  gameTime,
  onSubmit,
  onClose,
  isSubmitting,
}: ScoreModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ScoreFormData>({
    resolver: zodResolver(scoreSchema),
  });

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleFormSubmit = (data: ScoreFormData) => {
    onSubmit(data.initials.toUpperCase());
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            🎉 Congratulations!
          </h2>
          <p className="text-gray-600">
            You completed the game in{" "}
            <span className="font-mono font-bold">{formatTime(gameTime)}</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Your score qualifies for the leaderboard!
          </p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your initials (max 3 characters):
            </label>
            <input
              {...register("initials")}
              type="text"
              maxLength={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-mono uppercase"
              placeholder="ABC"
              autoFocus
            />
            {errors.initials && (
              <p className="text-red-500 text-sm mt-1">
                {errors.initials.message}
              </p>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting ? "Saving..." : "Save Score"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              Skip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScoreModal;
