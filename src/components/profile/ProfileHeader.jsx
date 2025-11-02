import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Loader2, Shield } from "lucide-react";

export default function ProfileHeader({ 
  hasAvatar, 
  avatarUrl, 
  displayName, 
  initials, 
  role, 
  triggerAvatarFile, 
  avatarUploading, 
  handleRemoveAvatar, 
  avatarError, 
  avatarMessage, 
  handleAvatarFileChange,
  fileInputRef
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-16 w-16 border border-red-200 cursor-pointer">
              {hasAvatar ? (
                <AvatarImage src={avatarUrl} alt={displayName} />
              ) : null}
              <AvatarFallback className="bg-gradient-to-br from-rose-500 via-red-400 to-red-500 text-lg font-semibold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={triggerAvatarFile}>
              Cambiar foto
            </DropdownMenuItem>
            {hasAvatar && (
              <DropdownMenuItem onClick={handleRemoveAvatar}>
                Quitar foto
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="space-y-1">
          <CardTitle className="text-xl text-slate-900 sm:text-2xl">
            {displayName}
          </CardTitle>
          <CardDescription className="flex items-center gap-2 text-slate-600">
            <Shield className="h-4 w-4" />
            {role}
          </CardDescription>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarFileChange}
        />
        {avatarUploading ? (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin text-rose-400" />
            Procesando imagen...
          </div>
        ) : null}
        {avatarError ? (
          <p className="text-xs text-red-600">{avatarError}</p>
        ) : null}
        {avatarMessage ? (
          <p className="text-xs text-emerald-600">{avatarMessage}</p>
        ) : null}
      </div>
    </div>
  );
}
