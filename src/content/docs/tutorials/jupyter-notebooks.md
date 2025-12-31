---
title: Developing Spark applications using Jupyter Notebooks
description: Developing Spark applications using Jupyter Notebooks using Orchestera Platform
---
When it comes to building and iterating on code, there is no better way than to spin up a quick Jupyter notebook session and code your way!

This tutorial highlights how you can easily do that using Orchestera platform.

**Note: You should be logged into the member account for the following steps**

## Prerequisites

This tutorial assumes the following:

1. You have given your Spark cluster access to S3 by using the steps defined in [Giving S3 access](/guides/giving-access-to-s3/).
2. You have IAM credentials setup for a user that's member of the `orchestera-platform-devs` and you have successfully verified your kubectl CLI permissions as documented [here](/guides/user-access-to-spark-cluster/).
3. You have cloned the repo at https://github.com/Orchestera/orchestera-hello-world.git
4. You have created a sample S3 bucket in your member account. Remember to plug in your bucket name in `<your-bucket-name>` in the code below.


## Launch a pre-built Jupter notebook in your Spark cluster

From inside the `orchestera-hello-world` directory on your local setup, run the following command (replace `<namespace>` with one of the namespaces you specified at cluster creation):

```bash
make launch-prebuilt-jupyter-notebook NAMESPACE=<namespace>
```

This will launch a Jupyter notebook inside your cluster. You can check if the pod is running using the following:

```bash
❯ kubectl get pod jupyter -n <namespace>
NAME      READY   STATUS    RESTARTS   AGE
jupyter   1/1     Running   0          26m
```

Once the STATUS is Running, run `make port-forward-jupyter-notebook NAMESPACE=<namespace>`. You can now access your notebook at http://localhost:8888/. Enter `dev` for the password.

## Writing your first Spark pipeline

Create a new Jupyter notebook using the `Spark Python 3.10` kernel and enter the following code in your notebook:

```python
import os
import logging

from pyspark.sql import SparkSession

from orchestera.spark.session import OrchesteraSparkSession

from orchestera.entrypoints.sparklith_entrypoint import SparklithEntryPoint

from orchestera.entrypoints.base_entrypoint import StringArg

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SparkK8sHelloWorld(SparklithEntryPoint):

    application_name = StringArg(required=True, tooltip="Name of the application")

    def run(self):
        """Code entrypoint"""

        bucket = "<your-bucket-name>"
        prefix = "ookla-outputs"

        with OrchesteraSparkSession(
            app_name="SparkK8sHelloWorld",
            executor_instances=4,
            executor_cores=2,
            executor_memory="8g",
            additional_spark_conf={},
        ) as spark:
            sqlContext = SparkSession(spark)
            spark.sparkContext.setLogLevel("ERROR")

            # Read OOKLA metrics from publicly available S3 data
            df = spark.read.parquet("s3a://ookla-open-data/parquet/performance/type=fixed/year=2019/quarter=1/2019-01-01_performance_fixed_tiles.parquet").repartition(4)
            
            df.show()
            print(df.printSchema())

            df.createOrReplaceTempView('tempSource')

            print('Register the DataFrame as a SQL temporary view: source')
            df.createOrReplaceTempView('tempSource')
            
            newdf = spark.sql('SELECT * FROM tempSource LIMIT 1000')

            # Write CSV
            output_uri_csv = f"s3a://{bucket}/{prefix}/newdf.csv"
            newdf.write.mode("overwrite").option("header", True).csv(output_uri_csv)

            # Write Parquet
            output_uri_parquet = f"s3a://{bucket}/{prefix}/newdfparquet"
            newdf.write.mode("overwrite").option("compression", "snappy").parquet(output_uri_parquet)


SparkK8sHelloWorld().run()

```

This pipeline reads OOKLA metrics data publicly available on S3 and launches 4 Spark executors with 2 cores and 8GB memory each to process the data and store it as csv and parquet in your specified bucket.

Behind the scenes, Orchestera platform would take care of the following:
- Bring up nodes to be able to place Spark executors
- Run Spark executors on them
- Downscale the nodes after the pipeline run completes, hence minizing your cluster usage costs automatically
