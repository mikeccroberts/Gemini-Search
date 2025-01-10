import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Source {
  title: string;
  url: string;
  snippet: string;
}

interface SourcePreviewModalProps {
  source: Source | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SourcePreviewModal({ source, isOpen, onClose }: SourcePreviewModalProps) {
  if (!source) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
            <DialogHeader>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <DialogTitle className="text-xl font-semibold mb-2">
                  {source.title}
                </DialogTitle>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2"
                >
                  <span className="truncate">{source.url}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </motion.div>
            </DialogHeader>

            <ScrollArea className="flex-1 mt-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="prose prose-slate dark:prose-invert max-w-none"
              >
                <div className="space-y-4">
                  <p className="text-base leading-relaxed">
                    {source.snippet}
                  </p>
                  {/* TODO: Add full content preview when available */}
                </div>
              </motion.div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
