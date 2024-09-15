from __future__ import absolute_import, unicode_literals
from celery import shared_task
from django.utils import timezone
from .models import Job
from .execute_code import execute_code
from bson import ObjectId
import asyncio

@shared_task
def process_job(job_id, is_test_case):
   

    print('process picked',job_id)
    job = Job.find_one({'_id':ObjectId(job_id)})
    print(job)
    print(type(job))
    if job:

        job['started_at'] = timezone.now()

        try:
            result =  execute_code(job['language'], job['file_path'], is_test_case)
            #print(result['output'])
            job['completed_at'] = timezone.now()
            job['status'] = "success"
            job['output'] = result['output']
        except Exception as e:
            job['completed_at'] = timezone.now()
            job['status'] = "error"
            job['output'] = str(e)

        result =  Job.update_one(
                {'_id': ObjectId(job_id)},
                {'$set': {
                    'started_at': job['started_at'],
                    'completed_at': job['completed_at'],
                    'status': job['status'],
                    'output': job['output']
                }}
            )

        # Check if the update was successful
        if result.modified_count > 0:
            print('Job updated successfully.')
        else:
            print('No document updated. It may not exist or the fields might already be correct.')

        return True
    else:
        raise ValueError("Job not found")

def add_job_to_queue(job_id, is_test_case):
    task = process_job.apply_async(args=[job_id, is_test_case])
    return task.id