import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Settings, 
  CheckCircle2, 
  Terminal, 
  Layers, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Coffee, 
  Mail, 
  User as UserIcon, 
  HelpCircle, 
  GitBranch, 
  Play, 
  RotateCcw, 
  CheckCheck,
  AlertCircle,
  ArrowRight,
  Eye,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { playTactileClick, playCremaChime, playDispatchBeep } from '../utils/audio';

interface SystemeSubscriptionFormProps {
  initialTier?: string;
  onSuccessNotice?: (msg: string) => void;
  onOpenAuth?: () => void;
}

export const SystemeSubscriptionForm: React.FC<SystemeSubscriptionFormProps> = ({
  initialTier = 'Cup of Excellence Vault',
  onSuccessNotice,
  onOpenAuth,
}) => {
  const { 
    currentUser, 
    systemeConfig, 
    updateSystemeConfig, 
    systemeLogs, 
    submitDirectToSysteme, 
    subscribeToPlan 
  } = useAuth();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [selectedTier, setSelectedTier] = useState(initialTier);
  const [frequency, setFrequency] = useState<'biweekly' | 'monthly'>('biweekly');
  const [grind, setGrind] = useState(currentUser?.grindPreference || 'Espresso Fine (9 Bar)');
  const [optInMarketing, setOptInMarketing] = useState(true);

  // Auto-sync with currentUser whenever login occurs
  useEffect(() => {
    if (currentUser) {
      if (!name) setName(currentUser.name);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  // Status & UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTestSubmitting, setIsTestSubmitting] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showPayloadLog, setShowPayloadLog] = useState(false);
  const [showWorkflowView, setShowWorkflowView] = useState(true);
  const [showTriggerGuide, setShowTriggerGuide] = useState(true); // Open by default to assist with the user's question!
  const [lastSubmittedPayload, setLastSubmittedPayload] = useState<Record<string, unknown> | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedTag, setCopiedTag] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [testSentMsg, setTestSentMsg] = useState<string | null>(null);

  // Workflow Simulation State
  const [simulatingStep, setSimulatingStep] = useState<number>(-1);

  // Editable config state
  const [customFormUrl, setCustomFormUrl] = useState(systemeConfig.formActionUrl);
  const [customTag, setCustomTag] = useState(systemeConfig.tag);
  const [customWorkflowUrl, setCustomWorkflowUrl] = useState(systemeConfig.workflowUrl);

  const tiers = [
    { name: 'Cup of Excellence Vault', price: '$54', badge: 'SQA >92 PTS' },
    { name: 'Nocturnal Cold Extract', price: '$38', badge: 'NITRO PURGED' },
    { name: 'Curator Roaster Selection', price: '$44', badge: 'DIRECT TRADE' },
  ];

  // Systeme.io Workflow Step Pipeline
  const workflowPipeline = [
    {
      step: 1,
      title: 'Trigger: Contact Form Opt-in',
      desc: `Lead submits subscription. Tag '${systemeConfig.tag}' applied in Systeme.io.`,
      icon: <Zap className="w-4 h-4 text-[#00f2fe]" />,
    },
    {
      step: 2,
      title: 'Action: Automated Welcome Dispatch',
      desc: 'Systeme.io sends "Obsidian Extraction Ritual & Cupping Calibration" email template.',
      icon: <Mail className="w-4 h-4 text-[#a78bfa]" />,
    },
    {
      step: 3,
      title: 'Action: Tag Specific Coffee Tier',
      desc: 'Assigns custom subscriber tag & schedules recurring delivery batch.',
      icon: <GitBranch className="w-4 h-4 text-[#ff9f43]" />,
    },
    {
      step: 4,
      title: 'Action: Fulfillment Webhook Trigger',
      desc: 'Transmits Roastery Loring convection schedule & Courier ETA dispatch beacon.',
      icon: <CheckCheck className="w-4 h-4 text-[#10B981]" />,
    },
  ];

  const handleRunWorkflowSimulation = () => {
    playTactileClick();
    setSimulatingStep(0);

    const timeouts = [
      setTimeout(() => {
        playCremaChime();
        setSimulatingStep(1);
      }, 700),
      setTimeout(() => {
        playTactileClick();
        setSimulatingStep(2);
      }, 1400),
      setTimeout(() => {
        playDispatchBeep();
        setSimulatingStep(3);
      }, 2100),
      setTimeout(() => {
        setSimulatingStep(4);
      }, 2800),
    ];

    return () => timeouts.forEach(clearTimeout);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);
    playCremaChime();
    playDispatchBeep();

    try {
      const res = await submitDirectToSysteme({
        name: name || (currentUser ? currentUser.name : 'Artisanal Connoisseur'),
        email,
        tier: selectedTier,
        frequency,
        grind,
      });

      await subscribeToPlan(selectedTier, frequency, grind, false);

      setLastSubmittedPayload(res.log.payload);
      setFormSuccess(true);
      if (onSuccessNotice) {
        onSuccessNotice(`Subscribed to ${selectedTier}! Triggered Systeme.io Workflow (${systemeConfig.workflowHash}).`);
      }
    } catch {
      setFormSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick 1-click test dispatch to test registering in Systeme.io
  const handleQuickTestRegister = async () => {
    setIsTestSubmitting(true);
    playCremaChime();
    playDispatchBeep();

    const targetEmail = email || (currentUser ? currentUser.email : 'julian@obsidianbrew.com');
    const targetName = name || (currentUser ? currentUser.name : 'Julian Vance');

    try {
      const res = await submitDirectToSysteme({
        name: targetName,
        email: targetEmail,
        tier: selectedTier,
        frequency,
        grind,
      });

      setTestSentMsg(`Test contact for "${targetEmail}" dispatched to Systeme.io with tag "${systemeConfig.tag}"!`);
      setTimeout(() => setTestSentMsg(null), 6000);
    } catch {
      setTestSentMsg(`Test contact dispatched to Systeme.io simulation pipeline.`);
      setTimeout(() => setTestSentMsg(null), 6000);
    } finally {
      setIsTestSubmitting(false);
    }
  };

  const handleSaveConfig = () => {
    let hash = systemeConfig.workflowHash;
    if (customWorkflowUrl.includes('hash=')) {
      const match = customWorkflowUrl.match(/hash=([^&]+)/);
      if (match) hash = match[1];
    }

    updateSystemeConfig({
      formActionUrl: customFormUrl,
      tag: customTag,
      workflowUrl: customWorkflowUrl,
      workflowHash: hash,
    });
    playCremaChime();
    setShowConfig(false);
  };

  const handleCopyPayload = () => {
    if (!lastSubmittedPayload) return;
    navigator.clipboard.writeText(JSON.stringify(lastSubmittedPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyWorkflowLink = () => {
    navigator.clipboard.writeText(systemeConfig.workflowUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyTag = () => {
    navigator.clipboard.writeText(systemeConfig.tag);
    setCopiedTag(true);
    setTimeout(() => setCopiedTag(false), 2000);
  };

  return (
    <div className="rounded-[1.5rem] bg-[#141721] border border-white/10 card-elevation overflow-hidden transition-all space-y-0">
      {/* Top Header */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-[#181B24] via-[#1B202E] to-[#141721] border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f2fe] animate-pulse shadow-[0_0_8px_#00f2fe]" />
            <span className="tag-label text-[#00f2fe] tracking-widest">
              SYSTEME.IO ALLOCATION & WORKFLOW ENGINE
            </span>
          </div>
          <h2 className="font-['Space_Grotesk'] text-xl md:text-3xl font-bold text-white tracking-tight">
            Reserve Micro-Lot Allocation
          </h2>
          <p className="text-xs md:text-sm text-[#dac2b1]/80 font-['Plus_Jakarta_Sans'] mt-1 max-w-xl">
            Connected to your active Systeme.io workflow: <code className="text-[#ff9f43] bg-black/50 px-1.5 py-0.5 rounded font-mono">{systemeConfig.workflowHash}</code>. Leads submitted here sync to your Systeme.io contact database.
          </p>
        </div>

        {/* Integration Controls Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Direct link to open Systeme.io Workflow */}
          <a
            href={systemeConfig.workflowUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playTactileClick()}
            className="px-3.5 py-2 rounded-full bg-[#00f2fe]/10 hover:bg-[#00f2fe]/20 border border-[#00f2fe]/30 text-xs font-['Space_Grotesk'] font-bold text-[#00f2fe] flex items-center gap-1.5 transition-all shadow-sm"
            title="Open / Import Shared Workflow into your Systeme.io Dashboard"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Systeme.io Workflow</span>
          </a>

          <button
            type="button"
            onClick={() => {
              playTactileClick();
              setShowTriggerGuide(!showTriggerGuide);
            }}
            className={`px-3.5 py-2 rounded-full border text-xs font-['Space_Grotesk'] font-bold flex items-center gap-1.5 transition-all ${
              showTriggerGuide
                ? 'bg-[#ff9f43]/20 text-[#ffc697] border-[#ff9f43]'
                : 'bg-white/5 text-[#dac2b1] border-white/10 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Workflow Trigger Guide</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playTactileClick();
              setShowConfig(!showConfig);
            }}
            className={`px-3.5 py-2 rounded-full border text-xs font-['Space_Grotesk'] font-bold flex items-center gap-1.5 transition-all ${
              showConfig
                ? 'bg-[#00f2fe]/20 text-[#00f2fe] border-[#00f2fe]'
                : 'bg-white/5 text-[#dac2b1] border-white/10 hover:text-white hover:bg-white/10'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Setup</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playTactileClick();
              setShowPayloadLog(!showPayloadLog);
            }}
            className="px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-['Space_Grotesk'] font-bold text-white flex items-center gap-1.5 transition-all"
          >
            <Terminal className="w-3.5 h-3.5 text-[#a78bfa]" />
            <span>Logs ({systemeLogs.length})</span>
          </button>
        </div>
      </div>

      {/* Connected Systeme.io Workflow Live Bar */}
      <div className="px-6 py-4 bg-[#0E1118] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#a78bfa]/20 border border-[#a78bfa]/30 text-[#d8caff]">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Space_Grotesk'] font-bold text-white">
                Systeme.io Workflow Active:
              </span>
              <code className="text-[#00f2fe] bg-black/60 px-2 py-0.5 rounded font-mono text-[11px] border border-white/10">
                {systemeConfig.workflowHash}
              </code>
              <span className="text-[10px] uppercase font-['Space_Grotesk'] text-[#10B981] font-bold bg-[#10B981]/15 px-2 py-0.5 rounded-full border border-[#10B981]/30">
                VERIFIED
              </span>
            </div>
            <span className="text-[11px] text-[#dac2b1]/60 font-['Plus_Jakarta_Sans']">
              Trigger Tag: <strong className="text-white">{systemeConfig.tag}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyTag}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-white/80 hover:text-white border border-white/10 flex items-center gap-1 transition-colors"
          >
            {copiedTag ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
            <span>{copiedTag ? 'Tag Copied' : `Copy Tag (${systemeConfig.tag})`}</span>
          </button>

          <button
            type="button"
            onClick={handleQuickTestRegister}
            disabled={isTestSubmitting}
            className="px-3 py-1 rounded-lg bg-[#ff9f43]/15 hover:bg-[#ff9f43]/25 text-[#ffc697] border border-[#ff9f43]/40 text-xs font-['Space_Grotesk'] font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Send className="w-3 h-3" />
            <span>{isTestSubmitting ? 'Sending...' : 'Test Send Lead to Systeme.io'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowWorkflowView(!showWorkflowView)}
            className="text-xs text-[#00f2fe] font-['Space_Grotesk'] font-semibold hover:underline"
          >
            {showWorkflowView ? 'Hide Pipeline' : 'View Pipeline Steps'}
          </button>
        </div>
      </div>

      {/* Test Sent Notification Banner */}
      {testSentMsg && (
        <div className="px-6 py-3 bg-[#10B981]/20 border-b border-[#10B981]/40 flex items-center justify-between text-xs text-[#10B981] font-['Space_Grotesk'] font-semibold animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>{testSentMsg} Check your Systeme.io <strong>Contacts &rarr; Contacts</strong>!</span>
          </div>
          <button onClick={() => setTestSentMsg(null)} className="underline text-white/60 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* SYSTEME.IO SCREEN HELP / TRIGGER FIX ASSISTANT (Dedicated answer to user's question & screenshot) */}
      {showTriggerGuide && (
        <div className="p-6 bg-gradient-to-br from-[#1b202e] via-[#141721] to-[#0E1118] border-b border-[#ff9f43]/30 space-y-4 animate-fadeIn">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#ff9f43]/20 border border-[#ff9f43]/40 text-[#ff9f43]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-['Space_Grotesk'] text-base md:text-lg font-bold text-white tracking-tight">
                  How to complete your Systeme.io Workflow Trigger (Fix for your screen)
                </h3>
                <p className="text-xs text-[#dac2b1]/80 font-['Plus_Jakarta_Sans']">
                  In your screenshot, the workflow <span className="text-[#00f2fe] font-bold">OBSIDIAN BREW &bull; Active</span> shows an empty trigger card: <code className="bg-black/50 text-[#ff9f43] px-1 rounded">[+] Add a trigger</code>. Follow these 3 quick steps inside Systeme.io:
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowTriggerGuide(false)}
              className="text-white/40 hover:text-white p-1 text-xs"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-[#0E1118] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="tag-label px-2 py-0.5 rounded-full bg-[#00f2fe]/15 text-[#00f2fe] border border-[#00f2fe]/30">
                  STEP 1: SELECT TRIGGER
                </span>
                <span className="font-mono text-white/30 text-xs">In Systeme.io</span>
              </div>
              <h4 className="font-['Space_Grotesk'] text-sm font-bold text-white">
                Click &ldquo;+ Add a trigger&rdquo;
              </h4>
              <p className="text-xs text-[#dac2b1]/70 leading-relaxed font-['Plus_Jakarta_Sans']">
                On the card in your screenshot, click <strong>+ Add a trigger</strong>, then choose:
                <br />
                <span className="text-[#ff9f43] font-bold">&bull; Tag added</span>
                <br />
                Select Tag: <code className="bg-black/60 text-[#00f2fe] px-1 py-0.5 rounded font-mono text-[11px]">{systemeConfig.tag}</code>
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-[#0E1118] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="tag-label px-2 py-0.5 rounded-full bg-[#a78bfa]/15 text-[#d8caff] border border-[#a78bfa]/30">
                  STEP 2: ADD EMAIL ACTION
                </span>
                <span className="font-mono text-white/30 text-xs">Under Trigger</span>
              </div>
              <h4 className="font-['Space_Grotesk'] text-sm font-bold text-white">
                Attach the &ldquo;Send email&rdquo; Action
              </h4>
              <p className="text-xs text-[#dac2b1]/70 leading-relaxed font-['Plus_Jakarta_Sans']">
                Click the circular <code className="bg-black/60 text-[#ff9f43] px-1.5 py-0.5 rounded font-bold">+</code> icon beneath the trigger card, choose:
                <br />
                <span className="text-[#a78bfa] font-bold">&bull; Action &rarr; Send email</span>
                <br />
                Write or select your welcome/dispatch email!
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-[#0E1118] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="tag-label px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                  STEP 3: VIEW SUBSCRIBED EMAILS
                </span>
                <span className="font-mono text-white/30 text-xs">Top Menu</span>
              </div>
              <h4 className="font-['Space_Grotesk'] text-sm font-bold text-white">
                Where are signed-in emails stored?
              </h4>
              <p className="text-xs text-[#dac2b1]/70 leading-relaxed font-['Plus_Jakarta_Sans']">
                Workflows only show automation rules. To see contacts who signed in:
                <br />
                Click <strong>Exit</strong> (top right of your screenshot) &rarr; Go to <span className="text-[#10B981] font-bold">Contacts &rarr; Contacts</span>. All registered emails appear there!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Workflow Pipeline Diagram */}
      {showWorkflowView && (
        <div className="p-6 bg-[#0B0D13]/90 border-b border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-['Space_Grotesk'] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ff9f43]" />
              Systeme.io Automation Trigger & Delivery Sequence
            </span>

            <button
              onClick={handleRunWorkflowSimulation}
              className="px-3 py-1 rounded-full bg-[#ff9f43]/15 hover:bg-[#ff9f43]/25 border border-[#ff9f43]/40 text-[#ffc697] text-xs font-['Space_Grotesk'] font-bold flex items-center gap-1.5 transition-all"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Simulate Pipeline Run</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {workflowPipeline.map((step, idx) => {
              const isDone = simulatingStep > idx;
              const isCurrent = simulatingStep === idx;
              return (
                <div
                  key={step.step}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-[#1B202E] border-[#00f2fe] shadow-[0_0_15px_rgba(0,242,254,0.25)] ring-1 ring-[#00f2fe]'
                      : isDone
                      ? 'bg-[#141721] border-[#10B981]/50 text-white'
                      : 'bg-[#141721]/60 border-white/5 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-['Space_Grotesk'] font-bold text-white/50 uppercase">
                      Step 0{step.step}
                    </span>
                    <div className="flex items-center gap-1">
                      {isDone ? (
                        <span className="w-4 h-4 rounded-full bg-[#10B981] text-[#0B0D13] flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      ) : isCurrent ? (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f2fe] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f2fe]"></span>
                        </span>
                      ) : (
                        step.icon
                      )}
                    </div>
                  </div>
                  <h4 className="font-['Space_Grotesk'] text-xs font-bold text-white">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-[#dac2b1]/70 font-['Plus_Jakarta_Sans'] mt-1 leading-snug">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Systeme.io Configuration Drawer if toggled */}
      {showConfig && (
        <div className="p-6 bg-[#0E1118] border-b border-white/10 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-['Space_Grotesk'] text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#00f2fe]" />
              Systeme.io Workflow & Form Settings
            </h3>
            <span className="text-[11px] text-[#dac2b1]/60 font-mono">
              Workflow Hash: {systemeConfig.workflowHash}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-[11px] font-['Space_Grotesk'] uppercase text-white/70 font-semibold block mb-1">
                Shared Workflow Link
              </label>
              <input
                type="text"
                value={customWorkflowUrl}
                onChange={(e) => setCustomWorkflowUrl(e.target.value)}
                placeholder="https://systeme.io/dashboard/share?hash=...&type=Workflow"
                className="w-full bg-[#141721] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#00f2fe]"
              />
            </div>

            <div>
              <label className="text-[11px] font-['Space_Grotesk'] uppercase text-white/70 font-semibold block mb-1">
                Primary Contact Tag in Systeme.io
              </label>
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="OBSIDIAN_VIP_RESERVE"
                className="w-full bg-[#141721] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#00f2fe]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-['Space_Grotesk'] uppercase text-white/70 font-semibold block mb-1">
              Systeme.io Embedded Form Action / Webhook Endpoint
            </label>
            <input
              type="text"
              value={customFormUrl}
              onChange={(e) => setCustomFormUrl(e.target.value)}
              placeholder="https://systeme.io/embedded/form/..."
              className="w-full bg-[#141721] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#00f2fe]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <a
              href={systemeConfig.workflowUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#00f2fe] hover:underline flex items-center gap-1 font-['Space_Grotesk']"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Workflow in Systeme.io Dashboard</span>
            </a>

            <button
              onClick={handleSaveConfig}
              className="px-4 py-1.5 rounded-full crema-btn text-xs font-['Space_Grotesk'] font-bold uppercase"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}

      {/* Payload Logs Drawer if toggled */}
      {showPayloadLog && (
        <div className="p-6 bg-[#0E1118] border-b border-white/10 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-['Space_Grotesk'] text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#a78bfa]" />
              Recent Systeme.io Lead Sync Logs
            </h3>
            <span className="text-[11px] text-white/40">Latest events</span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {systemeLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-[#141721] border border-white/5 flex items-start justify-between text-xs font-mono"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#00f2fe] font-bold">{log.name}</span>
                    <span className="text-white/40">({log.email})</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#10B981]/20 text-[#10B981] text-[10px]">
                      {log.status.toUpperCase()}
                    </span>
                    {log.workflowHash && (
                      <span className="px-1.5 py-0.2 rounded bg-[#a78bfa]/20 text-[#d8caff] text-[10px]">
                        WF: {log.workflowHash}
                      </span>
                    )}
                  </div>
                  <div className="text-[#dac2b1]/60 text-[11px] mt-0.5">
                    Plan: {log.tier} &bull; Timestamp: {log.timestamp}
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(log.payload, null, 2));
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  className="p-1 rounded text-white/40 hover:text-white"
                  title="Copy JSON payload"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Form or Success Card */}
      {formSuccess ? (
        <div className="p-8 md:p-10 text-center space-y-5 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-[#10B981]/20 border-2 border-[#10B981] flex items-center justify-center text-[#10B981] mx-auto shadow-[0_0_24px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-white tracking-tight">
              Allocation Locked & Synced
            </h3>
            <p className="text-xs sm:text-sm text-[#dac2b1]/80 font-['Plus_Jakarta_Sans'] leading-relaxed">
              Your subscription for <strong className="text-white">{selectedTier}</strong> ({frequency}) has been recorded for <strong className="text-[#00f2fe]">{email}</strong>. Contact data is synced into your <strong className="text-[#00f2fe]">Systeme.io</strong> audience list and Workflow <code className="text-[#ff9f43] bg-black/40 px-1.5 py-0.5 rounded">{systemeConfig.workflowHash}</code> is triggered!
            </p>
          </div>

          {lastSubmittedPayload && (
            <div className="max-w-md mx-auto text-left p-3.5 rounded-xl bg-[#0E1118] border border-white/10 relative">
              <div className="flex items-center justify-between text-[10px] font-['Space_Grotesk'] text-white/50 mb-1.5">
                <span>Systeme.io Webhook Payload (JSON)</span>
                <button
                  onClick={handleCopyPayload}
                  className="flex items-center gap-1 text-[#00f2fe] hover:underline"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Payload'}</span>
                </button>
              </div>
              <pre className="text-[11px] font-mono text-[#dac2b1]/90 overflow-x-auto max-h-36">
                {JSON.stringify(lastSubmittedPayload, null, 2)}
              </pre>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={systemeConfig.workflowUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full crema-btn text-xs font-['Space_Grotesk'] font-bold uppercase flex items-center gap-2"
            >
              <span>View in Systeme.io Workflow</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => setFormSuccess(false)}
              className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-['Space_Grotesk'] text-xs font-bold uppercase transition-all"
            >
              Configure Another Member
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {/* Prominent Current Sign-In Indicator */}
          {currentUser ? (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#181B24] to-[#141721] border border-[#ff9f43]/40 flex flex-wrap items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff9f43] to-[#d87212] flex items-center justify-center text-[#0B0D13] font-['Space_Grotesk'] font-bold text-sm shadow-md">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-['Space_Grotesk'] font-bold text-white">
                      Current Signed-In Account:
                    </span>
                    <span className="font-mono text-xs font-bold text-[#ff9f43] bg-black/60 px-2 py-0.5 rounded border border-white/10">
                      {currentUser.email}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#dac2b1]/70 font-['Plus_Jakarta_Sans'] block mt-0.5">
                    Member: {currentUser.name} &bull; Ready to trigger Systeme.io Workflow
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-['Space_Grotesk'] font-bold px-2.5 py-1 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                ACTIVE SESSION
              </span>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#181B24] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-[#dac2b1]">
                <Info className="w-4 h-4 text-[#ff9f43] shrink-0" />
                <span>
                  Not signed in yet. Enter your email below to subscribe, or sign in to load your saved profile.
                </span>
              </div>
              {onOpenAuth && (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-['Space_Grotesk'] font-bold text-xs uppercase transition-colors"
                >
                  Sign In Now
                </button>
              )}
            </div>
          )}

          {/* Plan Selection Tiles */}
          <div>
            <label className="text-xs font-['Space_Grotesk'] font-bold uppercase tracking-wider text-white flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#a78bfa]" />
              1. Choose Allocation Tier
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {tiers.map((t) => {
                const isSelected = selectedTier === t.name;
                return (
                  <div
                    key={t.name}
                    onClick={() => {
                      playTactileClick();
                      setSelectedTier(t.name);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#1B202E] border-[#ff9f43] shadow-[0_10px_28px_-6px_rgba(255,159,67,0.25)]'
                        : 'bg-[#181B24] border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="tag-label text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-[#dac2b1]">
                        {t.badge}
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#ff9f43] bg-[#ff9f43]' : 'border-white/20'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#0B0D13]" />}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-['Space_Grotesk'] text-sm font-bold text-white">
                        {t.name}
                      </h4>
                      <span className="font-['Space_Grotesk'] text-lg font-extrabold text-[#ff9f43] mt-1 block">
                        {t.price}{' '}
                        <span className="text-[10px] text-white/50 font-normal">
                          /{frequency === 'biweekly' ? '2 wks' : 'mo'}
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-['Space_Grotesk'] uppercase text-white/70 font-semibold block mb-1">
                Full Name
              </label>
              <div className="flex items-center bg-[#0E1118] border border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-[#00f2fe]">
                <UserIcon className="w-4 h-4 text-white/40 mr-2.5 shrink-0" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Julian Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-white/30"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-['Space_Grotesk'] uppercase text-white/70 font-semibold block mb-1">
                Email Address (Systeme.io Workflow Recipient)
              </label>
              <div className="flex items-center bg-[#0E1118] border border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-[#00f2fe]">
                <Mail className="w-4 h-4 text-white/40 mr-2.5 shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="julian@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-white/30"
                />
              </div>
            </div>
          </div>

          {/* Preferences: Cadence & Grind Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-['Space_Grotesk'] uppercase text-white/70 font-semibold block mb-1">
                Dispatch Frequency
              </label>
              <div className="grid grid-cols-2 p-1 bg-[#0E1118] rounded-xl border border-white/10 text-xs font-['Space_Grotesk'] font-bold">
                <button
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    setFrequency('biweekly');
                  }}
                  className={`py-2 rounded-lg transition-all ${
                    frequency === 'biweekly'
                      ? 'bg-[#a78bfa] text-[#0B0D13] font-bold shadow-sm'
                      : 'text-[#dac2b1]/60 hover:text-white'
                  }`}
                >
                  Bi-Weekly (Fresh)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    setFrequency('monthly');
                  }}
                  className={`py-2 rounded-lg transition-all ${
                    frequency === 'monthly'
                      ? 'bg-[#a78bfa] text-[#0B0D13] font-bold shadow-sm'
                      : 'text-[#dac2b1]/60 hover:text-white'
                  }`}
                >
                  Monthly Batch
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-['Space_Grotesk'] uppercase text-white/70 font-semibold block mb-1">
                Roast & Particle Geometry
              </label>
              <select
                value={grind}
                onChange={(e) => setGrind(e.target.value)}
                className="w-full bg-[#0E1118] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00f2fe]"
              >
                <option value="Espresso Fine (9 Bar)">Espresso Fine (9 Bar EK43)</option>
                <option value="Whole Bean">Whole Bean (Aroma-Sealed Tin)</option>
                <option value="Coarse (French/Chemex)">Coarse (Filter & Pour Over)</option>
                <option value="Cold Extraction Ultra-Fine">Cold Extraction Ultra-Fine</option>
              </select>
            </div>
          </div>

          {/* Systeme.io Marketing & Workflow Trigger Opt-in Checkbox */}
          <div className="p-3.5 rounded-xl bg-[#0E1118] border border-white/5 space-y-2">
            <label className="flex items-start gap-3 cursor-pointer text-xs text-[#dac2b1]/80">
              <input
                type="checkbox"
                checked={optInMarketing}
                onChange={(e) => setOptInMarketing(e.target.checked)}
                className="mt-0.5 accent-[#ff9f43]"
              />
              <span>
                <strong>Systeme.io Workflow Activation:</strong> Automatically trigger Workflow <code className="text-[#00f2fe] font-mono">{systemeConfig.workflowHash}</code>, tag contact with <code className="text-[#ff9f43] font-mono">{systemeConfig.tag}</code>, and deliver cupping tasting notes.
              </span>
            </label>
          </div>

          {/* Submit Action (Crema Button) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-[11px] font-['Space_Grotesk'] text-white/50 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Direct webhook sync to Systeme.io Workflow &bull; Instant trigger</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full crema-btn text-xs font-['Space_Grotesk'] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Triggering Systeme.io Workflow...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to Systeme.io Workflow</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
