import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogFooter
} from "@/shared/components";

interface ConfirmDialogProps {
    children: React.ReactNode;
    title: string;
    desc: string;
    onConfirm: () => void | Promise<void>;
}

function ConfirmDialog({ children, title, desc, onConfirm }: ConfirmDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent
                showCloseButton={false}
                className="bg-[#312d2d] border border-white/10 text-white rounded"
            >
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {desc}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>

                    <DialogClose asChild>
                        <Button
                            variant={"destructive"}
                            className="rounded"
                            onClick={onConfirm}
                        >
                            Согласен
                        </Button>
                    </DialogClose>

                    <DialogClose asChild>
                        <Button
                            variant={"ghost"}
                            className="rounded hover:bg-white/10"
                        >
                            Отмена
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export { ConfirmDialog }