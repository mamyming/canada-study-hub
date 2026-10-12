import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout, agentNav } from "@/components/layouts";
import {
  AutoChecks,
  DocsList,
  NoteAction,
  OfferInvoiceCard,
  PaymentsCard,
  StudentSummary,
  Timeline,
} from "@/components/application-views";
import { Button, Card, Empty, SectionTitle, StatusBadge } from "@/components/ui-kit";
import { formatDate } from "@/lib/data";
import { missingDocs, useStore } from "@/lib/store";

export const Route = createFileRoute("/agent/applications/$appId")({
  head: () => ({
    meta: [
      { title: "ตรวจสอบใบสมัคร (Agent) | MapleLeaf Education" },
      { name: "description", content: "ดูข้อมูลนักเรียน หลักสูตร ผลสอบภาษา และเอกสารทั้งหมดในหน้าเดียวเพื่อตรวจสอบ" },
      { property: "og:title", content: "ตรวจสอบใบสมัคร (Agent) | MapleLeaf Education" },
      { property: "og:description", content: "ระบบสรุปผลตรวจอัตโนมัติให้เอเจนต์ตัดสินใจได้เร็วขึ้น" },
    ],
  }),
  component: AgentAppDetail,
});

function AgentAppDetail() {
  const { appId } = Route.useParams();
  const { db, act } = useStore();
  const app = db.applications.find((a) => a.id === appId);

  if (!app)
    return (
      <DashboardLayout nav={agentNav} title="Application">
        <Empty>ไม่พบใบสมัครนี้</Empty>
      </DashboardLayout>
    );

  const miss = missingDocs(app.docs);
  const payPending = app.payments.find((p) => p.status === "รอตรวจสอบการชำระเงิน");

  return (
    <DashboardLayout nav={agentNav} title={`Application ${app.id}`}>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <StatusBadge status={app.status} />
        <span className="text-sm text-muted-foreground">ส่งเมื่อ {formatDate(app.submittedAt)}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <StudentSummary app={app} />
          <AutoChecks app={app} />
          <DocsList app={app} />
          <div>
            <SectionTitle title="Offer & Invoice" />
            <OfferInvoiceCard app={app} />
          </div>
          <div>
            <SectionTitle title="Payment" />
            <PaymentsCard app={app} />
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <p className="mb-3 font-semibold">การดำเนินการ</p>
            <div className="flex flex-wrap gap-2">
              {app.status === "รอตรวจสอบ" && (
                <>
                  <Button
                    disabled={miss.length > 0}
                    onClick={() => act(app.id, "agent_send_college")}
                  >
                    ส่ง Application ให้ College
                  </Button>
                  <NoteAction label="ส่งกลับให้ Student แก้ไข" variant="danger" onSubmit={(note) => act(app.id, "agent_return", { note })} />
                </>
              )}
              {app.status === "ออก Offer แล้ว" && (
                <Button onClick={() => act(app.id, "agent_forward_docs")}>ส่ง Offer & Invoice ให้นักเรียน</Button>
              )}
              {payPending && (
                <>
                  <Button variant="success" onClick={() => act(app.id, "agent_verify_payment")}>
                    ยืนยันหลักฐานและส่งให้ College
                  </Button>
                  <NoteAction
                    label="ส่งกลับให้แก้ไขการชำระเงิน"
                    variant="danger"
                    onSubmit={(note) => act(app.id, "agent_reject_payment", { note })}
                  />
                </>
              )}
              {app.status !== "รอตรวจสอบ" && app.status !== "ออก Offer แล้ว" && !payPending && (
                <p className="text-sm text-muted-foreground">ขณะนี้ไม่มีงานที่ต้องให้คุณดำเนินการกับใบสมัครนี้</p>
              )}
            </div>
            {!!miss.length && <p className="mt-3 text-xs text-destructive">เอกสารยังไม่ครบ: ขาด {miss.join(", ")}</p>}
          </Card>
          <Timeline app={app} />
          <Card>
            <p className="mb-2 font-semibold">ประวัติการดำเนินการ</p>
            <ol className="space-y-2 text-sm">
              {[...app.history].reverse().map((h, i) => (
                <li key={i} className="border-b border-border/60 pb-2 last:border-0">
                  <p className="font-medium">{h.status}</p>
                  <p className="text-xs text-muted-foreground">
                    {h.by} · {formatDate(h.at)}
                  </p>
                  {h.note && <p className="text-xs text-destructive">{h.note}</p>}
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
