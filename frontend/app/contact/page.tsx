export default function ContactPage() {
  return (
    <main className="w-full bg-white min-h-[600px] px-4 py-8 md:px-8 font-serif">
      <div className="max-w-3xl mx-auto bg-white text-black text-[16px] leading-relaxed">
        <h1 className="text-3xl md:text-4xl font-bold text-[#000044] mb-10 text-center border-b-2 border-orange-500 pb-4 flex justify-center">
          Contacts
        </h1>

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
              <p>Assistant Professor, Department of CSE (AI &amp; ML)</p>
              <p>KIET (Deemed to be University), Delhi-NCR, Ghaziabad, India</p>
              <p className="pt-2">
                <strong>Email: </strong>
                <a href="mailto:info.ijaiqt@kiet.edu" className="hover:underline">
                  info.ijaiqt@kiet.edu
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
