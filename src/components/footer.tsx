import Link from "next/link";
import Image from "next/image";
export function Footer() {
  return (
    <footer className="bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/">
              <span className="sr-only">PS Foundation</span>
              <Image
                width={300}
                height={300}
                src="/logo.svg"
                alt="PS Foundation Logo"
              />
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Purshottam Sevashram Foundation is dedicated to serving the
              community through various social initiatives and programs.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-4">
              {["About", "Services", "Donate", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-base text-gray-500 hover:text-gray-900"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-4">
              <li className="text-base text-gray-500">
                Near Mahi Electric factory, Madhwas - Limbodara Road, Madhwas,
                389230
              </li>
              <li className="text-base text-gray-500">Phone:+91 9892744448</li>
              <li className="text-base text-gray-500">
                Email: narendra@psfoundation.co.in
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            © 2024 Purshottam Sevashram Foundation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
