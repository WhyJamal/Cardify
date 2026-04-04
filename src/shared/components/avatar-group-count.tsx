import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
    // AvatarGroupCount,
    AvatarImage,
} from "@/shared/components/ui/avatar"
import { BoardMember, CardMember } from "../types"
import { getInitials } from "../utils/getInitials";

interface AvatarGroupCountProps {
    members: (BoardMember | CardMember)[];
}


export function AvatarGroupCount({ members }: AvatarGroupCountProps) {
    return (
        <AvatarGroup className="border-none">

            {members.map((member, index) => (
                <Avatar className="w-7 h-7" key={member.id ?? index}>
                    {member.user.image ? (
                        <AvatarImage
                            src={member.user.image ?? "https://github.com/shadcn.png"}
                            alt={member.user.name ?? "user"}
                        />
                    ) : (
                        <AvatarFallback
                            className="bg-green-700 text-xs font-medium"
                        >
                            {getInitials(member.user.name || "")}
                        </AvatarFallback>
                    )}
                </Avatar>
            ))}
            {/* <AvatarGroupCount>+3</AvatarGroupCount> */}
        </AvatarGroup>
    )
}
