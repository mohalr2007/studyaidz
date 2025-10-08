import QuizHost from "@/components/quizzes/quiz-host";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function QuizzesPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">إنشاء اختبارات قصيرة</CardTitle>
                    <CardDescription>
                        اختر مادة من المواد، وسيقوم الذكاء الاصطناعي بتوليد اختبار قصير مع أسئلة متعددة الاختيارات لتقييم معرفتك.
                    </CardDescription>
                </CardHeader>
            </Card>
            <QuizHost />
        </div>
    );
}
