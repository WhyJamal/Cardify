export default function Loading() {
    return (
        <div className="flex items-start justify-center mx-auto min-h-screen p-10 bg-[#1d2125]">
            <svg className="spinner" viewBox="25 25 50 50">
                <circle className="spinner-circle" r="20" cy="50" cx="50"></circle>
            </svg>
        </div>
    );
}
