import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'

function Signup() {
    return (
            <div className="px-4 py-2">
                        <Dialog>
                        <DialogTrigger>Sign up</DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                            <DialogTitle>Sign up to CLIPR</DialogTitle>
                            <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="Email" className="text-right">
                            Email
                            </Label>
                            <Input type="email "id="Email" placeHolder="Email" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                            Username
                            </Label>
                            <Input id="username" placeHolder="Clipr Username" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                            Password
                            </Label>
                            <Input type="password" id="password" placeHolder="Clipr Password" className="col-span-3" />
                        </div>
                        <div className="flex justify-center items-center">
                        <Button className="w-1/2 justify-center">Sign up</Button>
                        </div>
                        </div>
                            </DialogHeader>
                        </DialogContent>
                        </Dialog>
                        </div>
    )
}

export default Signup