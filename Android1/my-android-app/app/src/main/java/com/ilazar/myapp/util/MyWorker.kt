package com.ilazar.myservices.util

import android.content.Context
import android.util.Log
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.ilazar.myapp.MyApplication

class MyWorker(
    context: Context,
    val workerParams: WorkerParameters
) : CoroutineWorker(context, workerParams) {
    override suspend fun doWork(): Result {
        val itemRepository = (applicationContext as MyApplication).container.itemRepository

        val notSaved = itemRepository.getLocallySaved()
        Log.d("MyWorker", notSaved.toString())

        notSaved.forEach{ item ->
            if(item._id.length < 12){

                itemRepository.save(item)
            }
            else{
                itemRepository.update(item)
            }
        }

        return Result.success()
    }
}