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
} from "@components/";

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
                className="bg-[#2b2c2f] border border-white/10 text-white rounded"
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
                            size={"lg"}
                            variant={"destructive"}
                            className="rounded"
                            onClick={onConfirm}
                        >
                            Согласен
                        </Button>
                    </DialogClose>

                    <DialogClose asChild>
                        <Button size={"lg"}>
                            Отмена
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export { ConfirmDialog }