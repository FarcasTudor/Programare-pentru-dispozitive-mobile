package com.ilazar.myapp.todo.ui.items

import android.util.Log
import androidx.compose.foundation.MutatePriority
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.ClickableText
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ilazar.myapp.todo.data.Item

typealias OnItemFn = (id: String?) -> Unit

@Composable
fun ItemList(itemList: List<Item>, onItemClick: OnItemFn) {
    Log.d("ItemList", "recompose")
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(12.dp)
    ) {
        items(itemList) { item ->
            ItemDetail(item, onItemClick)
        }
    }
}

@Composable
fun ItemDetail(item: Item, onItemClick: OnItemFn) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
            .background(
                color = Color.White,
                shape = RoundedCornerShape(16.dp)
            )
            .shadow(
                elevation = 18.dp,
                shape = RoundedCornerShape(16.dp)
            )
            .clickable { onItemClick(item._id) }
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
                .background(
                    color = Color.White,
                    shape = RoundedCornerShape(12.dp)
                ),
            horizontalArrangement = Arrangement.Center
        ) {
            Text(
                text = "Insulin Type: ",
                style = TextStyle(
                    fontWeight = FontWeight.Bold,
                    fontSize = 24.sp
                )
            )
            ClickableText(
                text = AnnotatedString(item.insulinType),
                style = TextStyle(
                    fontSize = 24.sp,
                ),
                onClick = { onItemClick(item._id) }
            )
        }
    }
}
