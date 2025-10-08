import Summarizer from "@/components/summaries/summarizer";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SummariesPage() {
    return (
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">تلخيص الدروس وتوليد الخرائط الذهنية</CardTitle>
                    <CardDescription>
                        قم برفع ملف PDF أو الصق نصًا لتلخيصه، ثم حوّل الملخص إلى خريطة ذهنية بصرية لتسهيل المراجعة.
                    </CardDescription>
                </CardHeader>
            </Card>
            <Summarizer />
        </div>
    );
}
