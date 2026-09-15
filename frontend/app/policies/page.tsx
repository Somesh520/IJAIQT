export default function PoliciesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Policies</h1>

      <div className="prose max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Publication Ethics</h2>
          <p className="text-gray-700">
            Our journal adheres to strict ethical standards based on international best practices.
            All parties involved in publishing - authors, editors, reviewers - are expected to
            maintain the highest standards of ethical behavior.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Open Access Policy</h2>
          <p className="text-gray-700">
            This is an open access journal which means that all content is freely available
            without charge to the user or their institution. Users are allowed to read, download,
            copy, distribute, print, search, or link to the full texts of the articles.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Copyright and Licensing</h2>
          <p className="text-gray-700">
            Authors retain copyright and grant the journal right of first publication.
            Articles are licensed under Creative Commons Attribution 4.0 International License.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Plagiarism Policy</h2>
          <p className="text-gray-700">
            All submissions are checked for plagiarism. Manuscripts with significant overlap
            with published work will be rejected. We use industry-standard plagiarism detection tools.
          </p>
        </section>
      </div>
    </div>
  )
}
