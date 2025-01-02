const { PiggyBank } = require("lucide-react");
const { default: Link } = require("next/link");

function Logo({ mobile }) {
  return (
    <Link href="/dashboard" className="flex items-center gap-2">
      {!mobile && (
        <PiggyBank className="stroke h-11 w-11 stroke-amber-500 stroke=[1.5]" />
      )}
      <p className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
        BudgetTracker
      </p>
    </Link>
  );
}

export default Logo;
