export default function TrustedBy() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold uppercase text-gray-500 tracking-wider">
          Trusted by over 100+ innovative companies
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-12 sm:gap-16 opacity-60 mix-blend-multiply grayscale">
          {/* Logo mockups using text to avoid missing images */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-2xl tracking-tighter">Acme<span className="text-primary">Corp</span></span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-2xl tracking-tighter font-serif italic">GlobalTech</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-2xl tracking-widest uppercase">Nexity</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-2xl tracking-tighter text-blue-800">Stratos</span>
          </div>
          <div className="flex items-center space-x-2 hidden md:block">
            <span className="font-bold text-2xl tracking-tight">Ozone</span>
          </div>
        </div>
      </div>
    </div>
  )
}
