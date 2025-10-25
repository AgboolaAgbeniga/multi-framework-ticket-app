import logoUrl from '../../../../assets/logo_footer.png';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <img src={logoUrl} alt="TicketFlex Logo" className="h-8 w-auto mb-4" />
            <p className="text-sm">
              Streamline your support workflow with our powerful ticket management system.
            </p>
          </div>
          
          <div>
            <h4 className="text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/auth/login" className="hover:text-white transition-colors">Login</a></li>
              <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white mb-4">Contact</h4>
            <p className="text-sm">
              Email: hngsupport@ticketflex.com<br />
              Phone: (+234) 8105027009
            </p>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} TicketFlex. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
