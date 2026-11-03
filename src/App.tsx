import React, { useState } from 'react';

// البنية الأولية الشجرية للفروع والكتب وأحكام النقض
const initialTreeData = [
  {
    id: 'civil-law',
    title: 'القانون المدني والتجاري',
    type: 'branch',
    children: [
      {
        id: 'civil-cassation',
        title: 'أحكام النقض - الدائرة المدنية',
        type: 'cassation_branch',
        children: [
          {
            id: 'cas-101',
            title: 'طعن رقم 4520 لسنة 88 ق - الالتزامات والعقود',
            type: 'cassation_item',
            fileType: 'word',
            appealNo: '4520',
            judicialYear: '88 ق',
            date: '2021-04-12',
            principle: 'المسؤولية العقدية لا تقوم إلا بتوافر أركانها الثلاثة: الخطأ والضرر وعلاقة السبب بينهما.',
            reasoning: 'وحيث إن الطعن أقيم على سبب واحد ينسحب على خطأ في تطبيق القانون، فلما كان الحكم المطعون فيه قد أقام قضاءه بالتعويض دون بيّنة مسوغة لشرط الضرر المباشر...',
            tags: ['التزامات', 'تعويض', 'عقود']
          }
        ]
      },
      {
        id: 'book-civil-code',
        title: 'الوسيط في شرح القانون المدني - السنهوري (10 مجلدات)',
        type: 'book',
        fileType: 'pdf',
        author: 'د. عبد الرزاق السنهوري',
        pages: 1250,
        content: 'موسوعة شرح القانون المدني المصري والمقارن وتشتمل على الالتزامات والأعيان والنصوص المستحدثة...',
        tags: ['شرح', 'مرجع رصين']
      }
    ]
  },
  {
    id: 'penal-law',
    title: 'قانون العقوبات والإجراءات الجنائية',
    type: 'branch',
    children: [
      {
        id: 'penal-cassation',
        title: 'أحكام النقض - الدائرة الجنائية',
        type: 'cassation_branch',
        children: [
          {
            id: 'cas-201',
            title: 'طعن رقم 1290 لسنة 91 ق - حالات بطلان القبض',
            type: 'cassation_item',
            fileType: 'scanned',
            appealNo: '1290',
            judicialYear: '91 ق',
            date: '2022-11-05',
            principle: 'بطلان التفتيش وما تلاه من إجراءات لا يسوغ الاعتماد عليه كدليل إدانة مستمد من إجراء غير مشروع.',
            reasoning: 'حيث إن التلبس حالة تلازم الجريمة ذاتها لا شخص مرتكبها، وكان الثابت أن الضابط أجرى الاستيقاف دون مبرر ظاهر...',
            tags: ['إجراءات جنائية', 'تفتيش', 'بطلان']
          }
        ]
      }
    ]
  }
];

export default function App() {
  const [treeData, setTreeData] = useState(initialTreeData);
  const [selectedNode, setSelectedNode] = useState(initialTreeData[0].children[0].children[0]);
  const [expandedNodes, setExpandedNodes] = useState({'civil-law': true, 'civil-cassation': true});
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // حوارات الإضافة
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [newBranchTitle, setNewBranchTitle] = useState('');
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookType, setNewBookType] = useState('pdf');
  const [targetBranchId, setTargetBranchId] = useState('civil-law');

  const toggleExpand = (id) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddBranch = (e) => {
    e.preventDefault();
    if (!newBranchTitle.trim()) return;

    const newBranchId = `branch-${Date.now()}`;
    const newBranch = {
      id: newBranchId,
      title: newBranchTitle,
      type: 'branch',
      children: [
        {
          id: `cassation-${newBranchId}`,
          title: `أحكام النقض - ${newBranchTitle}`,
          type: 'cassation_branch',
          children: []
        }
      ]
    };

    setTreeData([...treeData, newBranch]);
    setNewBranchTitle('');
    setIsAddBranchOpen(false);
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    if (!newBookTitle.trim()) return;

    const newBook = {
      id: `book-${Date.now()}`,
      title: newBookTitle,
      type: 'book',
      fileType: newBookType,
      author: 'مصدر شخصي / محلي',
      content: 'محتوى الكتاب المفهرس حديثاً داخل نظام المكتبة القانونية...',
      tags: ['جديد', 'مستورد']
    };

    const updateTree = (nodes) => {
      return nodes.map(node => {
        if (node.id === targetBranchId) {
          return { ...node, children: [...(node.children || []), newBook] };
        }
        if (node.children) {
          return { ...node, children: updateTree(node.children) };
        }
        return node;
      });
    };

    setTreeData(updateTree(treeData));
    setNewBookTitle('');
    setIsAddBookOpen(false);
  };

  const handleCopyWithCitation = (text, title) => {
    const citation = `${text}\n\n[المصدر: المكتبة القانونية الشاملة - ${title}]`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderTree = (nodes) => {
    return nodes.map((node) => {
      const isExpanded = expandedNodes[node.id];
      const hasChildren = node.children && node.children.length > 0;

      return (
        <div key={node.id} style={{ marginRight: '12px', userSelect: 'none' }}>
          <div 
            onClick={() => {
              if (hasChildren) toggleExpand(node.id);
              if (node.type !== 'branch' && node.type !== 'cassation_branch') {
                setSelectedNode(node);
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 8px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              backgroundColor: selectedNode?.id === node.id ? '#1e293b' : 'transparent',
              color: selectedNode?.id === node.id ? '#f59e0b' : '#cbd5e1',
              fontWeight: selectedNode?.id === node.id ? 'bold' : 'normal',
              marginBottom: '2px'
            }}
          >
            <span style={{ fontSize: '10px', color: '#64748b' }}>
              {hasChildren ? (isExpanded ? '▼' : '◀') : '•'}
            </span>

            <span>
              {node.type === 'branch' && '⚖️'}
              {node.type === 'cassation_branch' && '🛡️'}
              {node.type === 'book' && '📖'}
              {node.type === 'cassation_item' && '📜'}
            </span>

            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{node.title}</span>

            {node.fileType && (
              <span style={{
                marginRight: 'auto',
                fontSize: '9px',
                padding: '1px 5px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                border: '1px solid #475569',
                color: '#94a3b8'
              }}>
                {node.fileType}
              </span>
            )}
          </div>

          {hasChildren && isExpanded && (
            <div style={{ borderRight: '1px solid #334155', marginRight: '6px' }}>
              {renderTree(node.children)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', backgroundColor: '#020617', color: '#f8fafc', fontFamily: 'sans-serif' }} dir="rtl">
      
      {/* القائمة الجانبية */}
      <aside style={{ width: '300px', borderLeft: '1px solid #1e293b', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>⚖️</span>
          <h1 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>المكتبة القانونية الشاملة</h1>
        </div>

        <div style={{ padding: '12px', borderBottom: '1px solid #1e293b', display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setIsAddBranchOpen(true)}
            style={{ flex: 1, padding: '8px', fontSize: '11px', backgroundColor: '#78350f', color: '#fef3c7', border: '1px solid #b45309', borderRadius: '6px', cursor: 'pointer' }}
          >
            + إضافة فرع
          </button>
          <button 
            onClick={() => setIsAddBookOpen(true)}
            style={{ flex: 1, padding: '8px', fontSize: '11px', backgroundColor: '#064e3b', color: '#d1fae5', border: '1px solid #047857', borderRadius: '6px', cursor: 'pointer' }}
          >
            + إضافة كتاب/فولدر
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>شجرة الفروع والقوانين</div>
          {renderTree(treeData)}
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#020617' }}>
        
        <header style={{ padding: '12px 24px', borderBottom: '1px solid #1e293b', backgroundColor: '#0f172a' }}>
          <input 
            type="text" 
            placeholder="ابحث في المتون والأحكام والأرقام..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', maxWidth: '500px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px' }}
          />
        </header>

        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {selectedNode ? (
            <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #1e293b', pb: '16px', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 'bold' }}>
                    {selectedNode.type === 'cassation_item' ? 'حكم نقض' : 'مرجع قانوني'} • {selectedNode.fileType || 'PDF'}
                  </span>
                  <h2 style={{ fontSize: '20px', margin: '6px 0 0 0', color: '#f8fafc' }}>{selectedNode.title}</h2>
                </div>

                <button 
                  onClick={() => handleCopyWithCitation(selectedNode.principle || selectedNode.content, selectedNode.title)}
                  style={{ backgroundColor: '#1e293b', color: '#cbd5e1', border: '1px solid #334155', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                >
                  {copied ? '✓ تم النسخ والعزو' : '📋 نسخ مع العزو'}
                </button>
              </div>

              {selectedNode.type === 'cassation_item' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', backgroundColor: '#020617', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                    <div><span style={{ fontSize: '11px', color: '#64748b' }}>رقم الطعن:</span> <strong style={{ color: '#f59e0b', display: 'block' }}>{selectedNode.appealNo}</strong></div>
                    <div><span style={{ fontSize: '11px', color: '#64748b' }}>السنة القضائية:</span> <strong style={{ color: '#e2e8f0', display: 'block' }}>{selectedNode.judicialYear}</strong></div>
                    <div><span style={{ fontSize: '11px', color: '#64748b' }}>تاريخ الجلسة:</span> <strong style={{ color: '#e2e8f0', display: 'block' }}>{selectedNode.date}</strong></div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '13px', color: '#10b981', marginBottom: '6px' }}>المبدأ القانوني:</h3>
                    <p style={{ backgroundColor: '#064e3b15', borderRight: '4px solid #10b981', padding: '12px', margin: 0, fontSize: '15px', lineHeight: '1.6' }}>
                      {selectedNode.principle}
                    </p>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>الأسباب والمتن:</h3>
                    <div style={{ backgroundColor: '#020617', padding: '12px', borderRadius: '8px', fontSize: '14px', lineHeight: '1.6', color: '#cbd5e1' }}>
                      {selectedNode.reasoning}
                    </div>
                  </div>
                </div>
              )}

              {selectedNode.type === 'book' && (
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '13px' }}>المؤلف: {selectedNode.author}</p>
                  <div style={{ backgroundColor: '#020617', padding: '16px', borderRadius: '8px', fontSize: '15px', lineHeight: '1.6', color: '#cbd5e1', marginTop: '12px' }}>
                    {selectedNode.content}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '100px', color: '#64748b' }}>
              اختر فرعاً أو كتاباً من الشجرة جانباً للعرض
            </div>
          )}
        </div>
      </main>

      {/* حوار إضافة فرع */}
      {isAddBranchOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyCenter: 'center', padding: '16px' }}>
          <form onSubmit={handleAddBranch} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px', width: '320px', margin: 'auto' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#fff' }}>إضافة فرع قانوني جديد</h3>
            <input 
              type="text" 
              placeholder="اسم الفرع..."
              value={newBranchTitle}
              onChange={(e) => setNewBranchTitle(e.target.value)}
              style={{ width: '100%', padding: '8px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px', marginBottom: '12px' }}
            />
            <div style={{ display: 'flex', justifyEnd: 'flex-end', gap: '8px' }}>
              <button type="button" onClick={() => setIsAddBranchOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>إلغاء</button>
              <button type="submit" style={{ backgroundColor: '#d97706', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>إضافة</button>
            </div>
          </form>
        </div>
      )}

      {/* حوار إضافة كتاب */}
      {isAddBookOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyCenter: 'center', padding: '16px' }}>
          <form onSubmit={handleAddBook} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px', width: '320px', margin: 'auto' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#fff' }}>إضافة كتاب جديد</h3>
            
            <select 
              value={targetBranchId}
              onChange={(e) => setTargetBranchId(e.target.value)}
              style={{ width: '100%', padding: '8px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '12px', marginBottom: '8px' }}
            >
              {treeData.map(b => (
                <option key={b.id} value={b.id}>{b.title}</option>
              ))}
            </select>

            <input 
              type="text" 
              placeholder="عنوان الكتاب..."
              value={newBookTitle}
              onChange={(e) => setNewBookTitle(e.target.value)}
              style={{ width: '100%', padding: '8px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px', marginBottom: '8px' }}
            />

            <select 
              value={newBookType}
              onChange={(e) => setNewBookType(e.target.value)}
              style={{ width: '100%', padding: '8px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '12px', marginBottom: '12px' }}
            >
              <option value="pdf">مستند (PDF)</option>
              <option value="word">مستند نصي (Word)</option>
              <option value="scanned">نسخة ضوئية (Scanned)</option>
            </select>

            <div style={{ display: 'flex', justifyEnd: 'flex-end', gap: '8px' }}>
              <button type="button" onClick={() => setIsAddBookOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>إلغاء</button>
              <button type="submit" style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>إدراج</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}