function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`text-[#B6C2CF] text-[13px] font-bold ${className}`}>
            {children}
        </div>
    );
}

function HelperText({ children }: { children: React.ReactNode }) {
    return (
        <div className="text-[#596773] text-xs mt-1 leading-relaxed">
            {children}
        </div>
    );
}
export { Label, HelperText }