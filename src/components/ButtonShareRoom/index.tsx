"use client";
import { CheckIcon, LinkIcon } from "@chakra-ui/icons";
import { Button, type ButtonProps, useClipboard, useToast } from "@chakra-ui/react";
import { useTranslations } from "@/i18n";
import { useEffect, useState } from "react";
export function ButtonShareRoom(props: ButtonProps) { const t = useTranslations("share"); const toast = useToast(); const [roomUrl, setRoomUrl] = useState(""); const { hasCopied, onCopy, setValue } = useClipboard(roomUrl); useEffect(() => { const currentUrl = window.location.href; setRoomUrl(currentUrl); setValue(currentUrl); }, [setValue]); function handleCopyLink() { if (!roomUrl) { toast({ title: t("unavailable"), description: t("wait"), status: "error", duration: 3000, position: "top", isClosable: true }); return; } onCopy(); toast({ title: t("copied"), description: t("send"), status: "success", duration: 2500, position: "top", isClosable: true }); } return <Button leftIcon={hasCopied ? <CheckIcon /> : <LinkIcon />} variant="glass" onClick={handleCopyLink} aria-live="polite" {...props}>{hasCopied ? t("done") : t("copy")}</Button>; }
