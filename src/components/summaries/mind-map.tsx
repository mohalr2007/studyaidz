import { cn } from '@/lib/utils';

// Define the structure of a mind map node based on the expected AI output
interface MindMapNodeData {
  name: string;
  children?: MindMapNodeData[];
}

interface MindMapProps {
  data: MindMapNodeData;
}

interface NodeProps {
  node: MindMapNodeData;
  isRoot?: boolean;
}

// A simple color palette for different levels of the mind map
const colors = [
  'bg-primary/80 text-primary-foreground',
  'bg-accent/80 text-accent-foreground',
  'bg-secondary text-secondary-foreground',
  'bg-blue-200 text-blue-800',
  'bg-green-200 text-green-800',
  'bg-purple-200 text-purple-800',
];

const Node = ({ node, isRoot = false }: NodeProps) => {
  return (
    <li className="relative flex flex-col items-center">
      {/* Node content */}
      <div
        className={cn(
          'relative z-10 rounded-lg px-4 py-2 text-center shadow-md',
          isRoot ? 'bg-primary text-primary-foreground text-lg font-bold' : 'bg-card text-card-foreground border',
        )}
      >
        {node.name}
      </div>

      {/* Children */}
      {node.children && node.children.length > 0 && (
        <ul className="mt-8 flex justify-center gap-x-8 gap-y-12 flex-wrap">
          {/* Connecting line from parent to children branch */}
          <div className="absolute top-full h-8 w-px bg-border" />
          {node.children.map((child, index) => (
            <div key={index} className="relative">
              {/* Line from branch to child node */}
              <div className="absolute bottom-full right-1/2 h-8 w-px translate-x-1/2 bg-border" />
              <Node node={child} />
            </div>
          ))}
          {/* Horizontal line connecting children */}
           {node.children.length > 1 && <div className="absolute top-8 right-1/2 h-px w-full -translate-y-1/2 bg-border" /> }
        </ul>
      )}
    </li>
  );
};


const MindMap = ({ data }: MindMapProps) => {
  if (!data) {
    return <p>لا توجد بيانات لعرض الخريطة الذهنية.</p>;
  }

  return (
    <div className="w-full overflow-x-auto p-8 text-center">
        <style jsx>{`
            li {
                list-style: none;
            }
            .mindmap-container ul {
                position: relative;
                padding-top: 1rem;
                display: flex;
            }
            .mindmap-container li {
                float: left;
                text-align: center;
                position: relative;
                padding: 1rem .5rem 0 .5rem;
            }
            .mindmap-container li::before, .mindmap-container li::after {
                content: '';
                position: absolute;
                top: 0;
                right: 50%;
                border-top: 1px solid hsl(var(--border));
                width: 50%;
                height: 1rem;
            }
            .mindmap-container li::after {
                right: auto;
                left: 50%;
                border-left: 1px solid hsl(var(--border));
            }
            .mindmap-container li:only-child::after, .mindmap-container li:only-child::before {
                display: none;
            }
            .mindmap-container li:only-child {
                padding-top: 0;
            }
            .mindmap-container li:first-child::before, .mindmap-container li:last-child::after {
                border: 0 none;
            }
            .mindmap-container li:last-child::before {
                border-right: 1px solid hsl(var(--border));
                border-radius: 0 5px 0 0;
            }
            .mindmap-container li:first-child::after {
                border-radius: 5px 0 0 0;
            }
            .mindmap-container ul ul::before {
                content: '';
                position: absolute;
                top: 0;
                left: 50%;
                border-left: 1px solid hsl(var(--border));
                width: 0;
                height: 1rem;
            }
        `}</style>
      <ul className="mindmap-container inline-flex flex-col items-center">
        <Node node={data} isRoot />
      </ul>
    </div>
  );
};

export default MindMap;
