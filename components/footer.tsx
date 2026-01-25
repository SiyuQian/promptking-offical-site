const APP_URL = 'https://app.promptking.online'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="font-display text-lg font-bold text-navy">
              PromptKing
            </span>
          </div>
          <div className="text-gray-600 text-sm">
            © {new Date().getFullYear()} PromptKing. All rights reserved.
          </div>
          <div>
            <a
              href={APP_URL}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              Open App →
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
