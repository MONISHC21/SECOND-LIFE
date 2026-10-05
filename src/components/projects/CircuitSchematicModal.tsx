import React from 'react';
import { Project } from '../../types/index.ts';
import { X, Cpu, Zap, CheckCircle2, AlertTriangle } from 'lucide-react';

interface CircuitSchematicModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CircuitSchematicModal: React.FC<CircuitSchematicModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#0B1220] border border-slate-800 rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{project.name}</h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Circuit Wiring Diagram & Hardware Pinouts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-5 overflow-y-auto text-xs">
          {/* Engineering Pinout / Schematic Box */}
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
              Microcontroller Pinout & Wiring Connections
            </div>
            <pre className="p-4 bg-slate-950/90 border border-slate-800 rounded-lg text-teal-300 font-mono text-[11px] leading-relaxed overflow-x-auto selection:bg-teal-900">
              {project.circuitDiagram || '// Standard 3.3V / 5V GPIO logic bus connections.'}
            </pre>
          </div>

          {/* Component Requirements Table */}
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
              Bill of Materials (BOM)
            </div>
            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/40">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-medium">
                    <th className="py-2.5 px-3">Component</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-right">Required Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {project.requirements?.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-850/40 transition-colors">
                      <td className="py-2 px-3 text-slate-200 font-medium">
                        {req.component?.name || req.componentId}
                      </td>
                      <td className="py-2 px-3 text-slate-400">
                        {req.component?.category || 'Electronic Part'}
                      </td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums text-teal-400">
                        {req.requiredQuantity}x
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Assembly Steps */}
          {project.instructions && project.instructions.length > 0 && (
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
                Assembly & Build Sequence
              </div>
              <div className="space-y-2">
                {project.instructions.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-lg flex gap-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-teal-400 text-[11px] font-mono flex items-center justify-center shrink-0">
                      {step.stepNumber}
                    </span>
                    <div>
                      <div className="font-semibold text-white mb-0.5">{step.title}</div>
                      <div className="text-slate-400 leading-relaxed text-[11px]">{step.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety Notice */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2.5 text-[11px] text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Always verify polarity when hooking up 18650 Li-ion cells or external power packs. Double check common ground rails before applying current to prevent component latch-up.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 flex justify-end bg-slate-900/40">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors text-xs font-medium"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
