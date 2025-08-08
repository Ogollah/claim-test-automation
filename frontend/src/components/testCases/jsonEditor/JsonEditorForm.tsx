'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { JsonEditor } from 'json-edit-react'
interface JsonEditorFormProps {
  testcaseId?: string
  initialData?: any
}

export function JsonEditorForm({ testcaseId, initialData }: JsonEditorFormProps) {
  const [jsonData, setJsonData] = useState<any>(
    initialData || {
      formData: {
        test: "positive",
        title: "",
        patient: {
          id: "",
          name: "",
          gender: "",
          birthDate: "",
          identifiers: []
        },
        provider: {
          id: "",
          name: "",
          level: "",
          identifiers: []
        },
        use: {
          id: "claim"
        },
        productOrService: [],
        billablePeriod: {
          billableStart: "",
          billableEnd: "",
          created: ""
        },
        total: {
          value: 0,
          currency: "KES"
        }
      }
    }
  )

  // Load data if testcaseId is provided
  useEffect(() => {
    if (testcaseId) {
      const loadData = async () => {
        const data = jsonData
        // const data = await getTestcase(testcaseId)
        if (data?.test_config) {
          setJsonData(data.test_config)
        }
      }
      loadData()
    }
  }, [testcaseId])

  const handleSave = async () => {
    try {
    //   await saveTestcase({
    //     id: testcaseId,
    //     name: jsonData.formData.title || 'Untitled Test Case',
    //     test_config: jsonData
    //   })
    console.log(jsonData);
    
      // Add toast notification here
    } catch (error) {
      console.error('Failed to save:', error)
      // Add error toast here
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Case Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <JsonEditor 
            data={jsonData}
            setData={setJsonData}
          />
          <div className="flex justify-end">
            <Button onClick={handleSave}>
              Save Configuration
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}