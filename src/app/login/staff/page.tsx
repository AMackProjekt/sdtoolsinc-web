import Link from "next/link";
import { Lock } from "lucide-react";

export default function StaffLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-100 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-charcoal-900 text-white rounded-lg flex items-center justify-center mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-charcoal-900">Staff Portal</h1>
          <p className="text-slate-500 text-sm mt-2">Sign in to CaseFlow Command operations</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal-800 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition" 
              placeholder="staff@organization.org"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-800 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition" 
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-slate-600">
              <input type="checkbox" className="mr-2 rounded text-teal-600 focus:ring-teal-500" />
              Remember me
            </label>
            <a href="#" className="flex text-teal-600 hover:text-teal-700">Forgot password?</a>
          </div>

          <Link href="/portal/staff" className="w-full block text-center mt-6 bg-charcoal-900 text-white font-medium py-2.5 rounded-lg hover:bg-charcoal-800 transition">
            Sign In
          </Link>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
          Not a staff member? <Link href="/login/client" className="text-teal-600 hover:text-teal-700 font-medium">Go to Client Login</Link>
        </div>
      </div>
    </div>
  );
}
