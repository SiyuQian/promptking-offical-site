'use client'

const APP_URL = 'https://app.promptking.online'

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-8 animate-in fade-in duration-700">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          <span className="text-sm font-medium text-blue-900">
            Craft Perfect Prompts
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-navy mb-6 leading-tight text-balance animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          Stop Guessing.
          <br />
          <span className="text-blue-600">Start Creating.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed text-balance animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          A guided 5-step workflow to create prompts that truly resonate with
          AI. Follow a proven framework and build better prompts every time.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <a
            href={APP_URL}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Try PromptKing Free
          </a>
          <a
            href="#features"
            className="px-8 py-4 text-navy font-medium text-lg hover:text-blue-600 transition-colors"
          >
            Learn More →
          </a>
        </div>

        {/* Visual Element */}
        <div className="mt-16 relative">
          <div className="relative max-w-3xl mx-auto">
            {/* Abstract prompt visualization */}
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-2xl overflow-hidden">
              <div className="p-8 h-full flex flex-col justify-between">
                {/* Step indicators */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div
                      key={step}
                      className={`w-3 h-3 rounded-full transition-all duration-500 ${
                        step <= 3
                          ? 'bg-blue-600 scale-110'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Prompt preview */}
                <div className="flex-1 bg-white rounded-lg p-6 shadow-lg border border-gray-100">
                  <div className="space-y-3">
                    <div className="h-4 bg-blue-100 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-full" />
                    <div className="h-4 bg-gray-100 rounded w-5/6" />
                    <div className="h-4 bg-gray-100 rounded w-4/6" />
                  </div>
                </div>

                {/* Role badge */}
                <div className="mt-4 flex items-center justify-center">
                  <div className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium">
                    AI Expert
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200/30 rounded-full blur-2xl -z-10" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-indigo-200/30 rounded-full blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
