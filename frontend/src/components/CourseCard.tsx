import Link from 'next/link';
import {
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  PlayIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { Course } from '../../shared/types';

interface CourseCardProps {
  course: Course;
  showProgress?: boolean;
  progress?: number;
}

export default function CourseCard({ course, showProgress = false, progress = 0 }: CourseCardProps) {
  return (
    <div className="card-premium group !p-0 overflow-hidden flex flex-col h-full">
      {/* Course Thumbnail */}
      <div className="relative h-52 bg-gray-100 overflow-hidden">
        <img
          src={course.thumbnail || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop'}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link href={`/courses/${course.id}`}>
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-500 shadow-xl">
              <PlayIcon className="h-7 w-7 text-primary-600 ml-1" />
            </div>
          </Link>
        </div>

        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          <span className={`badge ${course.level === 'beginner' ? 'badge-success' :
              course.level === 'intermediate' ? 'badge-warning' : 'badge-danger'
            } shadow-sm px-3 py-1.5`}>
            {course.level === 'beginner' ? 'Iniciante' :
              course.level === 'intermediate' ? 'Intermédio' : 'Avançado'}
          </span>
        </div>

        {course.price > 0 && (
          <div className="absolute bottom-4 right-4">
            <span className="bg-white/90 backdrop-blur-md text-primary-900 font-bold px-4 py-2 rounded-xl shadow-lg border border-white/20">
              {course.formattedPrice || `MZN ${course.price.toLocaleString()}`}
            </span>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">{course.category}</span>
          <button className="text-gray-400 hover:text-yellow-500 transition-colors">
            <BookmarkIcon className="h-6 w-6" />
          </button>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2 min-h-[3.5rem]">
          <Link href={`/courses/${course.id}`}>
            {course.title}
          </Link>
        </h3>

        <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        <div className="mt-auto space-y-5">
          {/* Instructor and Stats */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                {course.instructor?.firstName?.[0]}{course.instructor?.lastName?.[0]}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">{course.instructor?.firstName} {course.instructor?.lastName}</span>
                <span className="text-xs text-gray-500">Expert</span>
              </div>
            </div>

            <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100">
              <StarIconSolid className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm font-bold text-yellow-700">{course.rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-gray-500 text-sm font-medium">
            <div className="flex items-center">
              <UserGroupIcon className="h-5 w-5 mr-1.5 text-gray-400" />
              <span>{course.enrollmentCount} Alunos</span>
            </div>
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 mr-1.5 text-gray-400" />
              <span>{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
            </div>
          </div>

          {showProgress ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-700">Progresso</span>
                <span className="text-primary-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className="bg-primary-600 h-full rounded-full shadow-inner transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <Link href={`/courses/${course.id}/learn`} className="btn btn-primary w-full py-3">
                Continuar
              </Link>
            </div>
          ) : (
            <Link href={`/courses/${course.id}`} className="btn btn-primary w-full py-4 text-base group/btn">
              Inscrever agora
              <PlayIcon className="h-5 w-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

