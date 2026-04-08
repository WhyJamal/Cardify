interface Props {
  name: string;
}

export function WorkspaceHeader({ name }: Props) {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4 pl-10">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-md bg-[#1db954] flex items-center justify-center text-black text-2xl font-bold">
            {name[0]}
          </div>
          <span className="text-[#b6c2cf] text-md font-bold">{name}</span>
        </div>
      </div>
    </section>
  );
}