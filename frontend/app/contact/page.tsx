export default function ContactPage() {
  return (
    <main className="w-full bg-white min-h-[600px] px-4 py-8 md:px-8 font-serif">
      <div className="max-w-3xl mx-auto bg-white text-black text-[16px] leading-relaxed pt-2">
        <div className="space-y-8">
          {/* Submission & Inquiries */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-center text-black mb-4">
              Submission &amp; Inquiries
            </h2>
            <p className="mb-3">
              Authors are invited to submit their original research work for the upcoming issue via email:
            </p>
            <p>
              <strong>Submission Email: </strong>
              <a href="mailto:ijaiqt@kiet.edu" className="hover:underline">
                ijaiqt@kiet.edu
              </a>
            </p>
          </div>

          {/* General Queries & Editorial Support */}
          <div className="pt-2">
            <h2 className="text-xl md:text-2xl font-bold text-center text-black mb-4">
              General Queries &amp; Editorial Support
            </h2>
            <p className="mb-4">
              For any questions regarding submitted manuscripts or paper status, please contact the Assistant Editor:
            </p>

            <div className="space-y-1">
              <p className="font-bold">Mr. Sarvesh Maurya</p>
              <p>Assistant Professor, Department of CSE (AI & ML)</p>
              <p>KIET (Deemed to be University), Delhi-NCR,</p>
              <p>Ghaziabad-Meerut Road, Ghaziabad,</p>
              <p>Uttar Pradesh-201206, India</p>
              <p className="pt-2">
                <strong>Email: </strong>
                <a href="mailto:info.ijaiqt@kiet.edu" className="hover:underline">
                  info.ijaiqt@kiet.edu
                </a>
              </p>
            </div>
          </div>

          {/* Grievances & Escalations */}
          <div className="pt-2">
            <h2 className="text-xl md:text-2xl font-bold text-center text-black mb-4">
              Grievances &amp; Escalations
            </h2>
            <p className="mb-4">
              For formal grievances or major editorial concerns, authors may reach out to:
            </p>

            <div className="space-y-1">
              <p className="font-bold">Prof. (Dr.) Puneet Garg</p>
              <p>Department of CSE (AI)</p>
              <p>KIET (Deemed to be University), Delhi-NCR,</p>
              <p>Ghaziabad-Meerut Road, Ghaziabad,</p>
              <p>Uttar Pradesh-201206, India</p>
              <p className="pt-2">
                <strong>Email: </strong>
                <a href="mailto:editor.ijaiqt@kiet.edu" className="hover:underline">
                  editor.ijaiqt@kiet.edu
                </a>

              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
