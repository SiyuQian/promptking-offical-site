const APP_URL = 'https://app.promptking.online'

export default function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-12 sm:p-16 shadow-2xl">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6 text-balance">
            Start Creating Better Prompts Today
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join users who are already crafting perfect prompts with our
            guided workflow.
          </p>
          <a
            href={APP_URL}
            className="inline-block px-10 py-5 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Try PromptKing Free →
          </a>
        </div>
      </div>
    </section>
  )
}
